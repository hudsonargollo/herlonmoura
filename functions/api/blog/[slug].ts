// Cloudflare Pages Function: /api/blog/[slug]
// GET    — single post
// PUT    — update post (requires auth)
// DELETE — delete post (requires admin)

interface Env {
  CRM_DB: D1Database;
  JWT_SECRET: string;
}

function json(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
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

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  try {
    const slug = (params as { slug: string }).slug;
    const db = env.CRM_DB;
    const post = await db.prepare("SELECT * FROM blog_posts WHERE slug = ?").bind(slug).first();
    if (!post) return json(404, { error: "Post not found" });
    return json(200, { post });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

export const onRequestPut: PagesFunction<Env> = async ({ request, params, env }) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) return json(401, { error: "Unauthorized" });
    if (user.role === "viewer") return json(403, { error: "Viewers cannot edit posts" });

    const slug = (params as { slug: string }).slug;
    const body = (await request.json()) as Record<string, any>;
    const db = env.CRM_DB;

    const existing = await db.prepare("SELECT id FROM blog_posts WHERE slug = ?").bind(slug).first();
    if (!existing) return json(404, { error: "Post not found" });

    const allowedFields = [
      "title", "meta_title", "meta_description", "excerpt", "content",
      "category", "status", "freebie_name", "requires_email",
      "questionnaire_enabled", "questionnaire_data", "author",
    ];
    const updates: string[] = [];
    const binds: any[] = [];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        binds.push(field === "questionnaire_data" ? JSON.stringify(body[field]) : body[field]);
      }
    }

    if (body.status === "published" && body.published_at !== false) {
      updates.push("published_at = COALESCE(published_at, ?)");
      binds.push(new Date().toISOString());
    }

    if (updates.length === 0) {
      return json(400, { error: "No valid fields to update" });
    }

    updates.push("updated_at = ?");
    binds.push(new Date().toISOString());
    binds.push(slug);

    await db.prepare(`UPDATE blog_posts SET ${updates.join(", ")} WHERE slug = ?`).bind(...binds).run();

    const updated = await db.prepare("SELECT * FROM blog_posts WHERE slug = ?").bind(slug).first();
    return json(200, { post: updated });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, params, env }) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) return json(401, { error: "Unauthorized" });
    if (user.role !== "admin") return json(403, { error: "Only admins can delete posts" });

    const slug = (params as { slug: string }).slug;
    const db = env.CRM_DB;
    const existing = await db.prepare("SELECT id FROM blog_posts WHERE slug = ?").bind(slug).first();
    if (!existing) return json(404, { error: "Post not found" });

    await db.prepare("DELETE FROM blog_posts WHERE slug = ?").bind(slug).run();
    return json(200, { deleted: true, slug });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};
