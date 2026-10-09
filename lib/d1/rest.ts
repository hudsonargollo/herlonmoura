// D1 REST API client — works from Next.js server-side without @cloudflare/d1.
// Uses the Cloudflare D1 HTTP REST API bound via the CRM_DB binding name.
const D1_BASE = process.env.CRM_D1_BASE || "";

export async function d1Fetch(sql: string, params: any[] = []): Promise<any> {
  const res = await fetch(`${D1_BASE}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sql, params }),
  });
  if (!res.ok) {
    const body: any = await res.json().catch(() => ({}));
    throw new Error(body.error || `D1 HTTP ${res.status}`);
  }
  return res.json();
}