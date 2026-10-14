// Cloudflare Pages Function: /api/crm/leads
// GET  — list leads (optional ?status=, ?source=, ?limit=) + stats
// POST — create a lead from contact form / questionnaire / test / freebie
//        + fire welcome email (Resend) + admin notification

/* ── Resend helpers (inlined — Pages Functions can't resolve shared imports) ── */

interface ResendPayload {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

async function trySendEmail(
  apiKey: string | undefined,
  payload: ResendPayload
): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY not configured" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as any;
    if (!res.ok) {
      return { ok: false, error: `Resend API ${res.status}: ${data.message || data.name || "unknown"}` };
    }
    return { ok: true, id: data.id };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

interface Env {
  CRM_DB: D1Database;
  JWT_SECRET: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  ADMIN_EMAIL?: string;
}

const VALID_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "appointment",
  "converted",
  "lost",
] as const;

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

function parseHistory(raw: unknown): Array<{ status: string; timestamp: string; note?: string }> {
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/* ── Email templates ──────────────────────────────────────────── */

function welcomeEmail(
  name: string, email: string, source: string | undefined, fromAddr: string
): ResendPayload {
  const firstName = name.split(" ")[0] || "Olá";
  const sourceLabel: Record<string, string> = {
    contact: "nosso formulário de contato",
    questionnaire: "nosso questionário de avaliação",
    whatsapp: "WhatsApp",
    referral: "indicação",
    social: "redes sociais",
    "varizes-assessment": "avaliação de varizes",
    "trombose-screening": "rastreamento de trombose",
  };
  const sourceText = sourceLabel[source ?? "contact"] ?? "nosso site";

  return {
    from: fromAddr,
    to: email,
    subject: `${firstName}, recebemos seu contato — Dr. Herlon Moura`,
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; color: #1e293b;">
        <div style="background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 32px 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0 0 8px;">Dr. Herlon Moura</h1>
          <p style="color: #ccfbf1; font-size: 13px; margin: 0;">Angiologista e Cirurgião Vascular — Salvador, BA</p>
        </div>
        <div style="background: #ffffff; padding: 28px 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 15px; line-height: 1.6;">Olá <strong>${firstName}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            Recebemos seu contato através de ${sourceText}. Nossa equipe entrará em contato
            em breve para agendar sua consulta ou esclarecer suas dúvidas.
          </p>
          <div style="background: #f0fdfa; border-left: 3px solid #14b8a6; padding: 12px 16px; margin: 20px 0; border-radius: 0 6px 6px 0;">
            <p style="font-size: 13px; margin: 0; color: #0f766e; font-weight: 600;">Precisa falar agora?</p>
            <p style="font-size: 13px; margin: 4px 0 0; color: #475569;">
              WhatsApp: <a href="https://wa.me/5571999159975" style="color: #14b8a6;">(71) 99915-9975</a>
            </p>
          </div>
          <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
            Atenciosamente,<br/>
            <strong>Equipe Dr. Herlon Moura</strong>
          </p>
        </div>
        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 16px;">
          Este é um e-mail automático. Não responda diretamente — use o WhatsApp acima.
        </p>
      </div>
    `,
    text: `Olá ${firstName},\n\nRecebemos seu contato através de ${sourceText}. Nossa equipe entrará em contato em breve.\n\nWhatsApp: (71) 99915-9975\n\nEquipe Dr. Herlon Moura`,
  };
}

function adminNotify(
  name: string, email: string, whatsapp: string | undefined, source: string | undefined,
  toAdmin: string, fromAddr: string
): ResendPayload {
  return {
    from: fromAddr,
    to: toAdmin,
    subject: `Novo lead: ${name} (${source ?? "contact"})`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; color: #1e293b;">
        <h2 style="font-size: 18px; color: #0f766e;">Novo lead no CRM</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #64748b; width: 100px;">Nome</td><td style="padding: 6px 0; font-weight: 600;">${name}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">E-mail</td><td style="padding: 6px 0;">${email}</td></tr>
          ${whatsapp ? `<tr><td style="padding: 6px 0; color: #64748b;">WhatsApp</td><td style="padding: 6px 0;">${whatsapp}</td></tr>` : ""}
          <tr><td style="padding: 6px 0; color: #64748b;">Fonte</td><td style="padding: 6px 0;">${source ?? "contact"}</td></tr>
        </table>
      </div>
    `,
    text: `Novo lead: ${name}\nE-mail: ${email}\n${whatsapp ? `WhatsApp: ${whatsapp}\n` : ""}Fonte: ${source ?? "contact"}`,
  };
}

/* ── Handlers ─────────────────────────────────────────────────── */

export const onRequestOptions: PagesFunction<Env> = async () => json(204, {});

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await verifyAuth(request, env);
  if (!user) return json(401, { error: "Unauthorized" });
  try {
    const db = env.CRM_DB;
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const source = url.searchParams.get("source");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "200", 10) || 200, 500);

    let query = "SELECT * FROM leads WHERE 1=1";
    const binds: any[] = [];
    if (status && status !== "all") {
      query += " AND status = ?";
      binds.push(status);
    }
    if (source && source !== "all") {
      query += " AND source = ?";
      binds.push(source);
    }
    query += " ORDER BY created_at DESC LIMIT ?";
    binds.push(limit);

    const results = await db.prepare(query).bind(...binds).all();
    const leads = (results.results ?? []).map((row: any) => ({
      ...row,
      status_history: parseHistory(row.status_history),
    }));

    const totalR = (await db.prepare("SELECT COUNT(*) as c FROM leads").first()) as any;
    const newR = (await db
      .prepare("SELECT COUNT(*) as c FROM leads WHERE status = 'new'")
      .first()) as any;

    const statusRows = await db
      .prepare("SELECT status, COUNT(*) as c FROM leads GROUP BY status")
      .all();
    const byStatus: Record<string, number> = {};
    for (const r of (statusRows.results ?? []) as any[]) byStatus[r.status] = r.c;

    return json(200, {
      leads,
      stats: { total: totalR?.c ?? 0, new: newR?.c ?? 0, byStatus },
    });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const db = env.CRM_DB;
    const body = (await request.json()) as Record<string, any>;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const status = body.status ?? "new";
    if (!VALID_STATUSES.includes(status as any)) {
      return json(400, { error: `Invalid status: ${status}`, valid: VALID_STATUSES });
    }

    const statusHistory = [{ status, timestamp: now, note: "lead created" }];

    // `leads.visitor_id` has a FK to `visitors(id)` and the deployed D1 has
    // foreign_keys=ON. The site's analytics sends an anonymous localStorage id
    // that has no row yet, so ensure the visitor exists before the lead insert
    // — otherwise every submission fails with a FK constraint error.
    if (body.visitor_id) {
      await db
        .prepare(
          `INSERT INTO visitors (id, email, name, first_seen, last_seen, total_visits)
           VALUES (?, ?, ?, ?, ?, 1)
           ON CONFLICT(id) DO UPDATE SET
             last_seen = excluded.last_seen,
             total_visits = total_visits + 1,
             email = COALESCE(visitors.email, excluded.email),
             name = COALESCE(visitors.name, excluded.name)`
        )
        .bind(
          body.visitor_id,
          body.email ?? null,
          body.name ?? null,
          now,
          now
        )
        .run();
    }

    // Automated lead scoring: source weight + engagement + risk score
    const sourceWeights: Record<string, number> = {
      whatsapp: 30, contact: 25, questionnaire: 20, freebie_download: 15,
      'varizes-assessment': 20, 'trombose-screening': 20, test: 15,
      blog: 10, social: 10, referral: 15,
    };
    const sourceScore = sourceWeights[body.source ?? "contact"] ?? 10;
    const riskScore = body.riskScore ?? 0;
    const engagementScore = Math.min(20, (body.engagement_events ?? 0) * 5);
    const emailBonus = body.email ? 10 : 0;
    const whatsappBonus = (body.whatsapp ?? body.phone) ? 10 : 0;
    const computedScore = Math.min(100, sourceScore + riskScore + engagementScore + emailBonus + whatsappBonus);
    const finalScore = Math.max(computedScore, body.score ?? 0);

    await db
      .prepare(
        `INSERT INTO leads (
           id, name, whatsapp, email, visitor_id, source, source_detail,
           status, score, tags, notes, next_action, status_history, status_changed_at,
           utm_source, utm_medium, utm_campaign, utm_term, utm_content, landing_page,
           interest, created_at, updated_at
         ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
      )
      .bind(
        id,
        body.name ?? "",
        body.whatsapp ?? body.phone ?? "",
        body.email ?? null,
        body.visitor_id ?? null,
        body.source ?? "contact",
        body.source_detail ?? body.subject ?? null,
        status,
        finalScore,
        JSON.stringify(body.tags ?? []),
        body.notes ?? "",
        body.next_action ?? "",
        JSON.stringify(statusHistory),
        now,
        body.utm_source ?? null,
        body.utm_medium ?? null,
        body.utm_campaign ?? null,
        body.utm_term ?? null,
        body.utm_content ?? null,
        body.landing_page ?? body.url ?? null,
        body.interest ?? null,
        now,
        now
      )
      .run();

    const iid = crypto.randomUUID();
    await db
      .prepare(
        "INSERT INTO interactions (id, lead_id, type, metadata, created_at) VALUES (?, ?, ?, ?, ?)"
      )
      .bind(
        iid,
        id,
        body.source === "questionnaire" ? "quiz_complete" : "contact_form",
        JSON.stringify(body),
        now
      )
      .run();

    // Fire welcome email + admin notification (best-effort, non-blocking)
    const fromAddr = env.EMAIL_FROM || "onboarding@resend.dev";
    const emailResults: Record<string, any> = {};
    if (body.email) {
      emailResults.welcome = await trySendEmail(
        env.RESEND_API_KEY,
        welcomeEmail(body.name ?? "", body.email, body.source, fromAddr)
      );
    }
    if (env.ADMIN_EMAIL) {
      emailResults.admin = await trySendEmail(
        env.RESEND_API_KEY,
        adminNotify(
          body.name ?? "",
          body.email ?? "",
          body.whatsapp ?? body.phone,
          body.source,
          env.ADMIN_EMAIL,
          fromAddr
        )
      );
    }

    return json(201, { id, status, created_at: now, emails: emailResults });
  } catch (e: any) {
    return json(500, { error: e.message });
  }
};
