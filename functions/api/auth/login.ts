// Cloudflare Pages Function: /api/auth/login
// POST — authenticate against the D1 users table, return JWT

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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export const onRequestOptions: PagesFunction<Env> = async () => json(204, {});

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { email, password } = (await request.json()) as { email: string; password: string };
    if (!email || !password) {
      return json(400, { error: "Email and password are required" });
    }

    const db = env.CRM_DB;
    const row = await db
      .prepare("SELECT id, email, name, role, password_hash FROM users WHERE email = ?")
      .bind(email)
      .first<{ id: string; email: string; name: string; role: string; password_hash: string }>();

    if (!row) {
      return json(401, { error: "Credenciais inválidas" });
    }

    // SHA-256 hash comparison (matches the worker implementation)
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    if (hashHex !== row.password_hash) {
      return json(401, { error: "Credenciais inválidas" });
    }

    // Sign JWT (HS256)
    const secret = env.JWT_SECRET || "dev-secret-change-me";
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 8 * 60 * 60; // 8 hours
    const body = btoa(JSON.stringify({ sub: row.id, email: row.email, role: row.role, iat, exp }))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    const signingInput = `${header}.${body}`;
    const key = await crypto.subtle.importKey(
      "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(signingInput));
    const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    const token = `${signingInput}.${sigB64}`;

    return json(200, {
      token,
      user: { id: row.id, name: row.name, email: row.email, role: row.role },
    });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};
