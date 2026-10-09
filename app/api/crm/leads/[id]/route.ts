import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/d1";

const VALID_STATUSES = new Set(["new", "contacted", "qualified", "appointment", "converted", "lost"]);

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const db = await getDB();
    const { id } = await params;
    const body = await req.json();
    const updates: string[] = [];
    const values: any[] = [];

    if (body.status !== undefined) {
      if (!VALID_STATUSES.has(body.status)) {
        return NextResponse.json({ error: `Invalid status: ${body.status}` }, { status: 400 });
      }
      updates.push("status = ?");
      values.push(body.status);
    }
    if (body.tags !== undefined) {
      updates.push("tags = ?");
      values.push(typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags));
    }
    if (body.notes !== undefined) {
      updates.push("notes = ?");
      values.push(body.notes);
    }
    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    updates.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(id);

    await db.prepare(`UPDATE leads SET ${updates.join(", ")} WHERE id = ?`).bind(...values).run();

    const row: any = await db.prepare("SELECT * FROM leads WHERE id = ?").bind(id).first();
    const lead = (row as any)?.results?.[0] ?? row;
    return NextResponse.json({ lead });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
