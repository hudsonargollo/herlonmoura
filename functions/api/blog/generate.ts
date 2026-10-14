// Cloudflare Pages Function: /api/blog/generate
// POST — generate blog articles via the CRM Worker's AI binding
// Requires admin auth. Posts are created as 'draft' for review.
// Proxies to the Worker's /api/blog/generate endpoint (which has the AI binding).

interface Env {
  CRM_DB: D1Database;
  JWT_SECRET: string;
  WORKER_URL?: string;
}

function json(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  });
}

export const onRequestOptions: PagesFunction<Env> = async () => json(204, {});

async function verifyAuth(request: Request, env: Env): Promise<{ sub: string; role: string } | null> {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  try {
    const secret = env.JWT_SECRET || "dev-secret-change-me";
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
    );
    const sig = Uint8Array.from(
      atob(parts[2].replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)
    );
    const valid = await crypto.subtle.verify("HMAC", key, sig, encoder.encode(`${parts[0]}.${parts[1]}`));
    if (!valid) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 80);
}

const VASCULAR_CATEGORIES = [
  "Varizes", "Trombose", "Doenças Arteriais", "Laser Vascular", "Cirurgia Vascular",
  "Linfedema", "Doenças Raynaud", "Angiologia Geral", "Endovascular", "Diagnóstico Vascular",
];

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) return json(401, { error: "Unauthorized" });
    if (user.role === "viewer") return json(403, { error: "Viewers cannot generate posts" });

    const body = (await request.json()) as { topics?: string[]; count?: number; category?: string };
    const { topics, count = 1, category } = body;

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return json(400, { error: "Topics array is required" });
    }

    const workerUrl = env.WORKER_URL || "https://herlon-moura-crm.hudsonargollo2.workers.dev";

    const workerRes = await fetch(`${workerUrl}/api/blog/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topics, count, category }),
    });

    const workerData = (await workerRes.json()) as any;

    if (!workerRes.ok) {
      return json(workerRes.status, { error: workerData.error || `Worker returned ${workerRes.status}` });
    }

    return json(200, workerData);
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};
