# Scheduling + Lead Automation — Plan & Architecture

Goal: a self-service booking engine embedded in the public site, wired into
the CRM, plus email nurture/follow-up and upsell sequences ("Triowire-style").

Written 2026-10-13. Review before implementation.

---

## 0. Current state (verified)

Already built and working:
- Lead ingestion: every form (contact, questionnaire, freebies) POSTs to
  `/api/crm/leads` → Cloudflare D1 (`CRM_DB`, db `herlonmoura_crm`).
- On lead create: fires a welcome email + admin notification via Resend
  (best-effort, non-blocking). Secrets on the Pages project:
  `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL`.
- Lead status workflow: 6 stages in `lib/leads.ts` —
  new → contacted → qualified → appointment → converted / lost, with an
  allowed-transition table and status history stored on the lead.
- Admin CRM dashboard: kanban, lead detail, manual email send
  (`POST /api/crm/email`).
- Self-hosted Cal.com: `calcom_web` / `cal_db` (pg16) / `cal_redis`, healthy.
  `NEXT_PUBLIC_WEBAPP_URL=https://cal.herlonmoura.clubemkt.digital`,
  email via Resend SMTP (noreply@resend.dev). DNS for that host already
  resolves to Cloudflare.

Not built / broken:
- Cal.com is bound to `127.0.0.1:3400` only — no public HTTPS, no nginx
  vhost, and it's still on the first-run setup screen (`/auth/setup?step=1`):
  no admin username, no event types. Nothing is embedded on the public site.
- No Cal.com → CRM webhook. A booking does not create or advance a lead.
- Email is one-shot only (welcome + admin on create). No drip/nurture
  sequence, no upsell, no freebie follow-up chain.
- Admin `AppointmentScheduler.tsx` calls `/api/crm/appointments`, which
  does not exist yet — it runs on hardcoded mock rows.

Net: the data model and ingestion spine exist; the automation layer on top
does not. This is a build, sequenced in three phases below.

---

## Phase 1 — Make the scheduler live, embed it, connect bookings to CRM

STATUS (2026-10-13): Origin side DONE and verified. Only the Cloudflare
edge certificate remains — see "Blocker" below.

### 1. Finish Cal.com first-run setup — PENDING (needs you)
   - Complete `/auth/setup` on the self-hosted instance: admin account,
     timezone (America/Bahia), availability (consultório hours).
   - Create event type(s): "Consulta – Angiologia / Cirurgia Vascular"
     (default 30–45 min). Set the required booking questions to match our
     lead fields (name, WhatsApp, email) so the webhook has what it needs.
   - Enable "Require additional notes" off; keep it short.

2. Expose it publicly (the real blocker)
   - DONE (origin): nginx vhost for `cal.herlonmoura.clubemkt.digital` →
     Cal.com. Two host-level fixes applied:
       * Cal.com now publishes `0.0.0.0:3400` (was `127.0.0.1:3400`,
         unreachable from other containers) — docker-compose.yml updated.
       * core_nginx (Swarm) config reloaded to include the cal vhost; it was
         serving a stale copy. Vhost proxies to `172.17.0.1:3400` via the
         docker bridge, matching every other service on this host.
     Verified: `Host: cal.herlonmoura...` on the origin returns Cal.com
     (307 → /auth/login → Setup page); all other sites still 200.
   - BLOCKER (Cloudflare edge — needs you): the public HTTPS handshake fails
     with "sslv3 alert handshake failure" and the host serves NO cert.
     The DNS record resolves to Cloudflare (104.21.29.83 / 172.67.148.161)
     but the hostname has no edge certificate / is not attached to a proxied
     origin in the `clubemkt.digital` zone. My wrangler OAuth token only has
     account/email scopes — no zone:edit — so I cannot fix this via API.
     ACTION (Cloudflare dashboard for zone clubemkt.digital):
       1. DNS → ensure `cal.herlonmoura` A record → VPS origin IP
          (62.171.137.90), Proxy status = Proxied (orange cloud).
       2. SSL/TLS → Edge Certificates → make sure Universal SSL covers it
          (it should, for *.clubemkt.digital); if the cert is custom/limited,
          the host won't get TLS until it's a normal proxied A record.
       3. After it propagates, `https://cal.herlonmoura.clubemkt.digital/`
          should load the Cal.com setup page.
     Alternatively: give me a Cloudflare API token with Zone.DNS (Edit) for
     clubemkt.digital and I'll create/fix the record myself.

3. Embed on the site — READY TO BUILD once the host is live (answer: BOTH)
   - Modal: Cal.com embed opened from hero CTA + Contato section.
   - Dedicated `/agendar` route hosting the embed (clean shareable URL).
   - Keep the existing WhatsApp lead-capture CTA as the secondary path
     (already shipped) — patients can book instantly OR chat.

4. Bookings → CRM webhook
   - New Pages Function: `functions/api/crm/webhooks/calcom.ts`
     - Verify Cal.com signature (`x-cal-signature-256`, HMAC of raw body
       with a `CALCOM_WEBHOOK_SECRET` secret).
     - On `BOOKING_CREATED`:
       - Upsert a lead by email (create if new, else reuse) tagged
         `source: "calcom"`.
       - Advance/move the lead to status `appointment`, push a
         `StatusHistoryEntry`, and store booking id + scheduled time.
       - Fire the "appointment confirmation" email (template in §Templates).
     - On `BOOKING_CANCELLED` / `BOOKING_RESCHEDULED`: update the stored
       appointment + history; notify admin.
   - Register the webhook URL in Cal.com (or Cal.com app store) pointing at
     the deployed function.
   - Add `CALCOM_WEBHOOK_SECRET` as a Pages secret.

5. Fill the real endpoint the admin panel already expects
   - Implement `functions/api/crm/appointments/index.ts` (GET list) backed by
     D1 so `AppointmentScheduler.tsx` stops showing mock rows.

Acceptance: book a real slot → lead appears/moves to "appointment" in the
CRM, patient + admin get emails, admin panel shows the appointment.

---

## Phase 2 — Email nurture / follow-up / upsell ("Triowire-style")

Outcome: new leads get a timed email sequence instead of a single welcome;
freebie downloaders get a drip; appointments get prep + follow-up; converted
patients get an upsell/recall.

Constraint that shapes the design: Cloudflare Pages Functions are
request-driven — there is no cron/worker scheduler on Pages. A drip engine
that waits N days needs a trigger. Options:

  Option A (recommended): Queue table + scheduled sender
    - D1 table `email_queue` (id, lead_id, template, send_after, status,
      payload_json). Enrollment writes future rows.
    - A tiny scheduled job on the VPS (cron) hits a secured Pages Function
      `POST /api/crm/email/process-queue` (bearer `QUEUE_SECRET`) every N
      minutes; it sends due rows via Resend and marks them sent.
    - Pros: full control, no vendor lock, works with current stack.
    - Cons: we run one cron.

  Option B: External ESP (Brevo/Mailchimp/Resend Broadcasts)
    - Push leads into an ESP and let its automation send the sequence.
    - Pros: robust scheduling, open/click analytics.
    - Cons: second vendor, data duplication, more setup.

  Recommend A. It reuses D1 + Resend we already have, and the queue is
  inspectable/retryable in the same DB.

Sequences to build (each = ordered steps in `email_queue`):

  S1 Welcome / freebie nurture (on lead create, source freebie)
     D0: deliver the freebie + intro (already partly exists)
     D2: "Você sabia?" — one educational post from the blog
     D5: soft CTA → book a consulta
     D9: urgency/offer nudge
     -> on booking: cancel remaining, switch to appointment flow

  S2 Consult nurture (on lead create, source contact/questionnaire)
     D0 welcome → D3 education → D7 social proof (RQE/UFBA/SBACV) → D10
     booking CTA.

  S3 Appointment lifecycle
     On booking: confirmation + how to prepare (bring exams, arrive 10 min).
     D-1 reminder. Post-visit (D+1): thank-you + care instructions.
     If status becomes "lost" after appointment: win-back (D+30).

  S4 Upsell / recall (on status "converted")
     D+30: check-in + related procedure (e.g. laser after sclerotherapy).
     D+90: annual Doppler recall. Opt-out footer on every email.

Rules:
- Every email has a one-click unsubscribe/opt-out that writes
  `unsubscribed_at` on the lead; the queue processor skips unsubscribed.
- Respect CAN-SPAM/LGPD: identify sender, physical address, opt-out.
- All sends are logged (interactions table) so the CRM timeline shows them.
- Template system: small HTML template registry keyed by `template` id,
  variable-interpolated ({name}, {whatsapp}, {doctor}), in
  `lib/email/templates.ts`. Shared header/footer + tokenized CTA URLs
  (WhatsApp deep link, booking link).

Acceptance: create a freebie lead → confirm 4 queued emails fire on
schedule; booking mid-drip cancels the rest; unsubscribe stops the queue.

---

## Phase 3 — Scoring, upsell logic, analytics

- Lead scoring refine (currently a `score` field): add points for
  high-intent actions (opened calculator, downloaded freebie, booked).
- Segment-based upsell: match converted patients to related procedures.
- Basic funnel analytics from existing data: source → status conversion,
  email open/click (needs Resend webhooks or ESP — see Option B).
- Optional: WhatsApp follow-up via the same queue (template → wa.me link or
  a WhatsApp API provider later).

---

## Templates needed (§Templates)

Shared parts: header (logo + doctor name), footer (address, CRM, opt-out),
CTA buttons (WhatsApp, Agendar). Content templates:
welcome, freebie-deliver, education-post, social-proof, booking-cta,
appointment-confirm, appointment-prep, appointment-reminder, post-visit,
win-back, upsell, recall.

---

## Secrets to add (Cloudflare Pages project)
- `CALCOM_WEBHOOK_SECRET` — HMAC key for booking webhooks.
- `QUEUE_SECRET` — bearer for the scheduled queue-processor endpoint.
(`RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL` already set.)

## Open questions for you
1. Public scheduler host: `cal.herlonmoura.clubemkt.digital` (already has DNS)
   or a subdomain of the main site? Recommend the former.
2. Embed style: modal opened from CTAs, a dedicated `/agendar` page, or both?
3. Keep the WhatsApp CTA alongside booking, or replace? Recommend keep both.
4. Phase 2 engine: our own D1 queue + VPS cron (Option A), or an external ESP
   (Option B)? Recommend A.
5. Appointment length / availability hours for the Cal.com event type?
