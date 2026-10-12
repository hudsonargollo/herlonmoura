import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/d1";

// GET /api/crm/leads?status=xxx  — list leads
// POST /api/crm/leads — create lead from contact form / questionnaire
export async function GET(req: NextRequest) {
  try {
    const db = await getDB();
    const url = new URL(req.url);
    const status = url.searchParams.get("status");

    let results: any;
    if (status && status !== "all") {
      results = await db.prepare("SELECT * FROM leads WHERE status = ? ORDER BY created_at DESC").bind(status).all();
    } else {
      results = await db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all();
    }
    const leads = (results as any).results ?? [];

    const totalR = await db.prepare("SELECT COUNT(*) as c FROM leads").first() as any;
    const newR = await db.prepare("SELECT COUNT(*) as c FROM leads WHERE status = 'new'").first() as any;

    return NextResponse.json({ leads, stats: { total: totalR?.c ?? 0, new: newR?.c ?? 0 } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await getDB();
    const body = await req.json();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.prepare(
      "INSERT INTO leads (id, name, whatsapp, email, source, source_detail, status, score, tags, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      id, body.name ?? "", body.whatsapp ?? body.phone ?? "", body.email ?? null,
      body.source ?? "contact", body.source_detail ?? body.subject ?? null,
      body.status ?? "new", body.score ?? body.riskScore ?? 0,
      JSON.stringify(body.tags ?? []), body.notes ?? "", now, now
    ).run();

    const iid = crypto.randomUUID();
    await db.prepare(
      "INSERT INTO interactions (id, lead_id, type, metadata, created_at) VALUES (?, ?, ?, ?, ?)"
    ).bind(iid, id, body.source === "questionnaire" ? "quiz_complete" : "contact_form", JSON.stringify(body), now).run();

    return NextResponse.json({ id, created_at: now }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}