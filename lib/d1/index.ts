let _db: any = undefined;

export function setD1Binding(db: any) {
  _db = db;
}

export function getD1() {
  if (typeof globalThis !== "undefined" && (globalThis as any).CRM_DB) {
    return (globalThis as any).CRM_DB;
  }
  return _db;
}

export async function getDB(): Promise<any> {
  const db = getD1();
  if (!db) throw new Error("D1 binding 'CRM_DB' not available — set CRM_DB env or bind via wrangler.toml");
  return db;
}