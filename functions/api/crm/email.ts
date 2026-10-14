// Cloudflare Pages Function: /api/crm/email
// POST — send a manual email to a lead via Resend
//
// Body: { leadId: string, subject: string, html?: string, text?: string }
// Fetches the lead's email from D1, sends via Resend, logs an interaction.

interface Env {
  CRM_DB: D1Database;
  JWT_SECRET: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
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

export const onRequestOptions: PagesFunction<Env> = async () => json(204, {});

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const user = await verifyAuth(request, env);
  if (!user) return json(401, { error: "Unauthorized" });
  try {
    const body = (await request.json()) as Record<string, any>;
    const { leadId, subject, html, text } = body;

    if (!leadId || !subject) {
      return json(400, { error: "leadId and subject are required" });
    }

    const db = env.CRM_DB;
    const lead = (await db
      .prepare("SELECT id, name, email FROM leads WHERE id = ?")
      .bind(leadId)
      .first()) as any;

    if (!lead) return json(404, { error: "lead not found" });
    if (!lead.email) return json(400, { error: "lead has no email address" });

    const fromAddr = env.EMAIL_FROM || "onboarding@resend.dev";

    // Send via Resend
    let sendResult: { ok: boolean; id?: string; error?: string };
    if (!env.RESEND_API_KEY) {
      sendResult = { ok: false, error: "RESEND_API_KEY not configured" };
    } else {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromAddr,
            to: lead.email,
            subject,
            html: html || `<p>${text || ""}</p>`,
            text,
          }),
        });
        const data = (await res.json()) as any;
        if (!res.ok) {
          sendResult = { ok: false, error: `Resend API ${res.status}: ${data.message || data.name || "unknown"}` };
        } else {
          sendResult = { ok: true, id: data.id };
        }
      } catch (e: any) {
        sendResult = { ok: false, error: e.message };
      }
    }

    // Log the email as an interaction
    const iid = crypto.randomUUID();
    const now = new Date().toISOString();
    await db
      .prepare(
        "INSERT INTO interactions (id, lead_id, type, metadata, created_at) VALUES (?, ?, ?, ?, ?)"
      )
      .bind(
        iid,
        leadId,
        "email_sent",
        JSON.stringify({ subject, resend_id: sendResult.id ?? null, ok: sendResult.ok, error: sendResult.error ?? null }),
        now
      )
      .run();

    if (!sendResult.ok) {
      return json(502, { error: sendResult.error, sent: false });
    }

    return json(200, { sent: true, id: sendResult.id });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};
