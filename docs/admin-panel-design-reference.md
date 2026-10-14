# Admin Panel UI — Design Reference (DEFERRED)

**Status:** Documented for later. Not implemented.
**Reference:** https://dribbble.com/shots/25260976-Retrospective-AI-2-version

## Why this is parked

The admin surface (`/admin/*` — dashboard, CRM, blog approval, email) currently
uses the stock shadcn/ui shell. It works and is not blocking anything. The
public site (hero, procedures, calculator, buttons, glass) is the active
priority. Revisit this once the public design language has settled, so the
admin panel can inherit it rather than being designed twice.

## What the reference is

A dense, dark "Retrospective AI" analytics dashboard. Key traits worth
porting to the CRM:

- **Dark-first canvas** with a single vivid accent; content sits on elevated
  panels rather than a flat background.
- **Dense data display** — the layout is built around metric tiles and
  sparkline/bar charts, not prose. Numbers are the hero.
- **Compact left rail navigation** with icon + label, active state marked by
  a filled accent bar rather than a background wash.
- **Cards as containers, not decoration** — minimal radius, hairline borders,
  almost no shadow. Depth comes from surface lightness steps, not blur.
- **Tabular numerals** in tables and metrics so columns align.

## How it should map onto our admin

| Reference trait | Our equivalent |
|---|---|
| Dark-first canvas | `:root.dark` is already the default admin look — reuse `--glass-*` dark tokens |
| Metric tiles | CRM lead counts, score distribution, source breakdown |
| Left rail | Existing admin nav — add the accent-bar active state |
| Dense tables | `/admin/crm` lead table — already close, needs tabular-nums |
| Minimal radius | Conflicts with the public site's `card-edge` notch — keep admin calmer |

## Deliberate divergences

- The public site uses **edgy, notched, glass** cards. The admin panel should
  stay **quieter and flatter** — an operator staring at a lead table for an
  hour does not want glow effects. Port the *token system* and *density*, not
  the ornament.
- Keep the existing shadcn/ui primitives. Restyle via tokens; do not rewrite
  the component layer.

## Concrete first step when picked up

1. Add an admin-scoped wrapper class (e.g. `.admin-shell`) that maps the
   `--glass-*` dark tokens to flatter, higher-contrast surfaces.
2. Add `font-variant-numeric: tabular-nums` to the CRM table cells.
3. Build a metric-tile component for the dashboard from the existing tokens.
4. Swap the admin nav active state to the accent-bar treatment.
