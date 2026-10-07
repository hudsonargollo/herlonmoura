// Placeholder — real Cloudflare D1 binding injected via wrangler.toml.
// On Cloudflare Pages, this resolves to the D1 binding named "CRM_DB".

let _conn: any = undefined;

export function setD1Connection(conn: any) {
  _conn = conn;
}

export function getConnection() {
  if (typeof globalThis !== "undefined" && (globalThis as any).CRM_DB) {
    return (globalThis as any).CRM_DB;
  }
  return _conn;
}