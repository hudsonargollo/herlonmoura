// Cloudflare Pages Function: /api/blog
// GET  — list posts (optional ?status=, ?category=, ?author=)
// POST — create a new post (requires auth)

interface Env {
  CRM_DB: D1Database;
  JWT_SECRET: string;
}

type PagesFunction<Env> = (ctx: {
  request: Request;
  env: Env;
  next?: () => Promise<Response>;
}) => Response | Promise<Response>;

function json(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const category = url.searchParams.get("category");
    const author = url.searchParams.get("author");

    const db = env.CRM_DB;
    let query = "SELECT * FROM blog_posts WHERE 1=1";
    const binds: string[] = [];
    if (status) { query += " AND status = ?"; binds.push(status); }
    if (category) { query += " AND category = ?"; binds.push(category); }
    if (author) { query += " AND author = ?"; binds.push(author); }
    query += " ORDER BY created_at DESC";

    let stmt = db.prepare(query);
    for (const b of binds) stmt = stmt.bind(b);
    const result = await stmt.all();

    return json(200, { posts: result.results ?? [] });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) return json(401, { error: "Unauthorized" });
    if (user.role === "viewer") return json(403, { error: "Viewers cannot create posts" });

    const body = (await request.json()) as Record<string, any>;
    const {
      slug, title, meta_title, meta_description, excerpt, content,
      category = "Geral", status = "draft", author = user.role === "admin" ? "Admin" : "Editor",
      freebie_name, questionnaire_enabled, questionnaire_data,
    } = body;

    if (!title || !content) {
      return json(400, { error: "Title and content are required" });
    }

    const db = env.CRM_DB;
    const id = crypto.randomUUID();
    const postSlug = slug || title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .trim()
      .slice(0, 80);

    // Calculate reading time (avg 200 words/min)
    const wordCount = content.split(/\s+/).length;
    const readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;

    await db.prepare(
      `INSERT INTO blog_posts (id, slug, title, meta_title, meta_description, excerpt, content, category, status, freebie_name, requires_email, questionnaire_enabled, questionnaire_data, author, reading_time, published_at, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(
      id, postSlug, title, meta_title || null, meta_description || null, excerpt || null, content,
      category, status, freebie_name || null, !!freebie_name, !!questionnaire_enabled,
      JSON.stringify(questionnaire_data || []), author, readingTime,
      status === "published" ? new Date().toISOString() : null,
      new Date().toISOString(), new Date().toISOString()
    ).run();

    return json(201, { id, slug: postSlug, title, status, readingTime });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) return json(401, { error: "Unauthorized" });

    const body = (await request.json()) as Record<string, any>;
    const { slug } = body;
    const updateFields: string[] = [];
    const binds: string[] = [];

    if (body.title !== undefined) {
      updateFields.push("title = ?");
      binds.push(body.title);
    }
    if (body.excerpt !== undefined) {
      updateFields.push("excerpt = ?");
      binds.push(body.excerpt);
    }
    if (body.meta_title !== undefined) {
      updateFields.push("meta_title = ?");
      binds.push(body.meta_title);
    }
    if (body.meta_description !== undefined) {
      updateFields.push("meta_description = ?");
      binds.push(body.meta_description);
    }
    if (body.content !== undefined) {
      updateFields.push("content = ?");
      binds.push(body.content);
    }
    if (body.category !== undefined) {
      updateFields.push("category = ?");
      binds.push(body.category);
    }
    if (body.author !== undefined) {
      updateFields.push("author = ?");
      binds.push(body.author);
    }
    if (body.status !== undefined) {
      updateFields.push("status = ?");
      binds.push(body.status);
    }

    updateFields.push("updated_at = ?");
    binds.push(new Date().toISOString());

    if (updateFields.length === 0) {
      return json(400, { error: "Nothing to update" });
    }

    binds.push(slug);

    await db.prepare(
      `UPDATE blog_posts SET ${updateFields.join(", ")} WHERE slug = ?`
    ).bind(...binds).run();

    return json(200, { slug, updated: true });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const slug = url.pathname.split('/').pop();
    if (!slug) return json(400, { error: "Missing slug" });

    const user = await verifyAuth(request, env);
    if (!user) return json(401, { error: "Unauthorized" });

    await db.prepare("DELETE FROM blog_posts WHERE slug = ?").bind(slug).run();
    return json(200, { deleted: true, slug });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};
