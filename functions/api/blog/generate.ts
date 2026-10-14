// Cloudflare Pages Function: /api/blog/generate
// POST — generate blog articles via ai.clubemkt.digital API
// Requires admin auth. Posts are created as 'draft' for review.

interface Env {
  CRM_DB: D1Database;
  JWT_SECRET: string;
  AI_API_URL?: string;
  AI_API_KEY?: string;
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

    const aiUrl = env.AI_API_URL || "https://ai.clubemkt.digital";
    const aiKey = env.AI_API_KEY || "";

    const generated: Array<{ id?: string; slug?: string; title?: string; topic?: string; error?: string }> = [];

    for (let i = 0; i < count; i++) {
      const topic = topics[i % topics.length];
      const postCategory = category || VASCULAR_CATEGORIES[i % VASCULAR_CATEGORIES.length];

      const prompt = `Gere um artigo de blog em português brasileiro sobre: ${topic}.
Use tom profissional e acessível, voltado para pacientes.
Estruture com título, meta_description, excerpt, conteúdo com subtítulos H2/H3.
Inclua: causas, sintomas, diagnóstico, tratamentos, prevenção, quando procurar médico.
Não inclua chamada para ação no final.
Retorne APENAS JSON válido com: title, meta_title, meta_description, excerpt, content, slug.`;

      try {
        const aiRes = await fetch(`${aiUrl}/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(aiKey ? { Authorization: `Bearer ${aiKey}` } : {}),
          },
          body: JSON.stringify({
            model: "default",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 4096,
          }),
        });

        if (!aiRes.ok) {
          // Fallback: try Cloudflare Workers AI binding if available
          generated.push({ topic, error: `AI API returned ${aiRes.status}` });
          continue;
        }

        const aiData = await aiRes.json() as any;
        const content = aiData.choices?.[0]?.message?.content || aiData.response || "";

        // Try to parse JSON from the response
        let parsed: any = null;
        try {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
        } catch { /* not JSON */ }

        const title = parsed?.title || topic;
        const slug = parsed?.slug || slugify(title);
        const articleContent = parsed?.content || content;
        const id = crypto.randomUUID();
        const wordCount = articleContent.split(/\s+/).length;
        const readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;

        await env.CRM_DB.prepare(
          `INSERT INTO blog_posts (id, slug, title, meta_title, meta_description, excerpt, content, category, status, author, reading_time, created_at, updated_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`
        ).bind(
          id, slug, title,
          parsed?.meta_title || title,
          parsed?.meta_description || parsed?.excerpt || "",
          parsed?.excerpt || "",
          articleContent, postCategory, "draft", "AI", readingTime,
          new Date().toISOString(), new Date().toISOString()
        ).run();

        generated.push({ id, slug, title });
      } catch (e: any) {
        generated.push({ topic, error: e.message });
      }
    }

    return json(200, { generated });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};
