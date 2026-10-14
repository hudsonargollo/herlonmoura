# Design System Documentation — Dr. Herlon Moura Medical Platform

## 1. Overview

This design system establishes a unified, high-performance visual and interaction framework for the Dr. Herlon Moura Medical Website. Engineered for modern dark-mode medical interfaces, it combines surgical precision with ambient glassmorphism effects. All tokens are synchronized across CSS custom properties (`app/globals.css`) and Tailwind CSS configurations (`tailwind.config.ts`) for scalable, responsive design.

---

## 2. Color Palette

### Primary Colors

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `dark-elevated` | `#0F172A` | Base background color, primary container fills |
| `surgical-teal` | `#14B8A6` | Primary accent, call-to-action buttons, active states |
| `surgical-teal-dark` | `#0D9488` | Hover/pressed states for primary interactive elements |

### Supporting & Status Colors

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `neutral-light` | `#F8FAFC` | Primary text, high-contrast borders on dark surfaces |
| `neutral-medium` | `#94A3B8` | Secondary body text, icons, disabled control states |
| `neutral-dark` | `#1E293B` | Elevated card backgrounds, sub-surface panels |
| `success-green` | `#10B981` | Positive outcomes, confirmed appointments, active status |
| `warning-amber` | `#F59E0B` | Cautions, pending statuses, operational notices |
| `error-red` | `#EF4444` | Form validation errors, critical alerts, cancel actions |

### Glassmorphism Tokens

| Token | RGBA Value | Usage |
|-------|-----------|-------|
| `glass-surface` | `rgba(15, 23, 42, 0.70)` | Standard glass panel background |
| `glass-surface-hover` | `rgba(15, 23, 42, 0.85)` | Elevated glass background on hover |
| `glass-border` | `rgba(20, 184, 166, 0.20)` | Subtle teal border outline |
| `glass-border-hover` | `rgba(20, 184, 166, 0.40)` | High-contrast teal border on hover |
| `glass-overlay` | `rgba(15, 23, 42, 0.40)` | Modal and backdrop dark dimming |

### CSS Variables Implementation

```css
:root {
  /* Brand & Status Colors */
  --color-dark-elevated: #0f172a;
  --color-surgical-teal: #14b8a6;
  --color-surgical-teal-dark: #0d9488;
  --color-neutral-light: #f8fafc;
  --color-neutral-medium: #94a3b8;
  --color-neutral-dark: #1e293b;
  --color-success-green: #10b981;
  --color-warning-amber: #f59e0b;
  --color-error-red: #ef4444;

  /* Glassmorphism Surface Variables */
  --color-glass-surface: rgba(15, 23, 42, 0.7);
  --color-glass-surface-hover: rgba(15, 23, 42, 0.85);
  --color-glass-border: rgba(20, 184, 166, 0.2);
  --color-glass-border-hover: rgba(20, 184, 166, 0.4);
  --color-glass-overlay: rgba(15, 23, 42, 0.4);
}
```

---

## 3. Typography System

### Font Stack

- **Heading Font**: Poppins, sans-serif
- **Primary Font**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- **Monospace Font**: Fira Code, monospace (technical notes, code snippets)

Fonts are loaded via `next/font/google` in `app/layout.tsx` and exposed as the `--font-inter`, `--font-poppins`, and `--font-fira-code` CSS variables.

### Type Scale

| Token | Font Size | Line Height | Weight | Usage |
|-------|-----------|-------------|--------|-------|
| `display-lg` | 48px (3rem) | 56px (3.5rem) | 700 (Bold) | Hero headlines |
| `display-md` | 36px (2.25rem) | 44px (2.75rem) | 700 (Bold) | Primary section headers |
| `heading-1` | 32px (2rem) | 40px (2.5rem) | 600 (SemiBold) | Main page titles |
| `heading-2` | 24px (1.5rem) | 32px (2rem) | 600 (SemiBold) | Section subheaders |
| `heading-3` | 20px (1.25rem) | 28px (1.75rem) | 600 (SemiBold) | Card title, modal header |
| `body-lg` | 18px (1.125rem) | 28px (1.75rem) | 400 (Regular) | Lead paragraph text |
| `body-regular` | 16px (1rem) | 24px (1.5rem) | 400 (Regular) | Default body copy |
| `body-small` | 14px (0.875rem) | 20px (1.25rem) | 400 (Regular) | Form labels, helper text |
| `caption` | 12px (0.75rem) | 16px (1rem) | 500 (Medium) | Timestamps, badge text |

---

## 4. Spacing Scale

Built on a strict 4px base grid system.

| Token | Value | Rem Equivalent | Primary Application |
|-------|-------|----------------|---------------------|
| `xs` | 4px | 0.25rem | Icon gaps, tight badge paddings |
| `sm` | 8px | 0.5rem | Button padding vertical, inline elements |
| `md` | 12px | 0.75rem | Input field vertical padding, card gaps |
| `lg` | 16px | 1rem | Standard element spacing, card padding |
| `xl` | 24px | 1.5rem | Container internal padding, section items |
| `2xl` | 32px | 2rem | Component margin bottom, modal spacing |
| `3xl` | 48px | 3rem | Large layout block spacing |
| `4xl` | 64px | 4rem | Section padding vertical |
| `5xl` | 80px | 5rem | Hero block padding vertical |

---

## 5. Responsive Breakpoints

Mobile-first responsive architecture matching device viewports.

| Token | Min Width | Target Devices | Utility Syntax Example |
|-------|-----------|----------------|------------------------|
| `mobile` | 320px | Compact smartphones | Default classes |
| `tablet` | 641px | Tablets, portrait displays | `tablet:grid-cols-2` |
| `desktop` | 1025px | Laptops, desktop monitors | `desktop:text-display-lg` |
| `ultra-wide` | 1441px | High-resolution displays | `ultra-wide:max-w-7xl` |

> **Note**: These custom screens are declared alongside Tailwind's default breakpoints (`sm:`, `md:`, `lg:`, `xl:`), which remain available for existing and third-party component styling.

---

## 6. Elevation, Shadows & Radii

### Shadow Tokens

| Token | Shadow Value | Usage |
|-------|--------------|-------|
| `shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Subtle inputs, flat buttons |
| `shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1)` | Hovered buttons, dropdown cards |
| `shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` | Floating menus, sticky headers |
| `shadow-glass` | `0 10px 30px 0 rgba(0, 0, 0, 0.35)` | Glassmorphic cards, modals |

### Border Radius Scale

| Token | Value | Applied To |
|-------|-------|------------|
| `rounded-sm` | 4px | Tags, tooltips, inline badges |
| `rounded-md` | 8px | Buttons, form inputs, select options |
| `rounded-lg` | 12px | Standard cards, notification toasts |
| `rounded-xl` | 16px | Glass panels, structural containers, modals |

### Z-Index Scale

| Token | Value | Target UI Component |
|-------|-------|---------------------|
| `z-dropdown` | 1000 | Select boxes, user menu options |
| `z-sticky` | 1020 | Sticky navigation bar |
| `z-fixed` | 1030 | Floating action buttons, CTA banners |
| `z-modal-backdrop` | 1040 | Dimming layer behind dialogs |
| `z-modal` | 1050 | Interactive modal windows |
| `z-popover` | 1060 | Dynamic rich content overlays |
| `z-tooltip` | 1070 | Contextual help tooltips |

---

## 7. Motion & Transitions

### Transition Speed Tokens

| Token | Duration | Timing Function | Usage |
|-------|----------|-----------------|-------|
| `duration-fast` | 150ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Hover triggers, button fills |
| `duration-base` | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Card expansions, tab switching |
| `duration-slow` | 500ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Modal fade-in, drawer slide |

### Native CSS Animations

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
.animate-slide-up { animation: slideUp 1s ease-out forwards; }
.animate-scale-in { animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
```

---

## 8. Glassmorphism Components & Utilities

Pre-configured CSS classes defined in `app/globals.css`:

```css
@layer components {
  /* Glass Base Card */
  .glass-card {
    background-color: var(--color-glass-surface);
    border: 1px solid var(--color-glass-border);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 16px;
    box-shadow: var(--shadow-glass);
    transition: all 300ms ease-in-out;
  }

  .glass-card:hover {
    background-color: var(--color-glass-surface-hover);
    border-color: var(--color-glass-border-hover);
  }

  /* Glass Form Input */
  .glass-input {
    background-color: rgba(15, 23, 42, 0.5);
    border: 1px solid var(--color-glass-border);
    color: var(--color-neutral-light);
    border-radius: 8px;
    padding: 12px 16px;
    backdrop-filter: blur(8px);
    transition: all 150ms ease-in-out;
  }

  .glass-input:focus {
    outline: none;
    border-color: var(--color-surgical-teal);
    box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.25);
  }

  /* Glass CTA Button */
  .glass-button {
    background-color: var(--color-surgical-teal);
    color: #ffffff;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 150ms ease-in-out;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .glass-button:hover {
    background-color: var(--color-surgical-teal-dark);
    box-shadow: 0 4px 14px rgba(20, 184, 166, 0.35);
  }

  /* Flex Helpers */
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .flex-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .flex-col-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /* Grid Helpers */
  .grid-auto-fit {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }
}
```

---

## 9. Accessibility (a11y) Standards

### Color Contrast

- **Text vs. Background**: Minimum 4.5:1 contrast ratio for normal text (`#F8FAFC` on `#0F172A` achieves 15.2:1 contrast).
- **Interactive UI Controls**: Exceeds WCAG 2.1 AA 3:1 contrast requirement.

### Keyboard Navigation Focus States

Standard focus outline ring:

```
focus-visible:ring-2 focus-visible:ring-surgical-teal focus-visible:ring-offset-2 focus-visible:ring-offset-dark-elevated
```

### Motion Reduction

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 10. React / Next.js Component Library Examples

### Hero Section (HeroSection.tsx)

```typescript
import React from "react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative flex-col-center min-h-[85vh] w-full bg-dark-elevated px-lg py-5xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-col-center max-w-4xl text-center gap-xl"
      >
        <span className="text-caption font-semibold tracking-wider text-surgical-teal uppercase bg-surgical-teal/10 px-md py-xs rounded-sm border border-surgical-teal/20">
          Medicina de Precisão & Cirurgia
        </span>
        <h1 className="text-display-md tablet:text-display-lg text-neutral-light font-heading">
          Cuidados Médicos Especializados com Excelência e Inovação
        </h1>
        <p className="text-body-lg text-neutral-medium max-w-2xl">
          Atendimento personalizado focado no bem-estar, inovação tecnológica e no tratamento humano e eficiente de cada paciente.
        </p>
        <div className="flex flex-col tablet:flex-row gap-lg mt-md">
          <button className="glass-button">Agendar Consulta</button>
          <button className="glass-card px-xl py-md text-neutral-light font-semibold hover:border-surgical-teal/50 transition-all">
            Conhecer Trajetória
          </button>
        </div>
      </motion.div>
    </section>
  );
}
```

### Medical Service Card Component (ServiceCard.tsx)

```typescript
import React from "react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function ServiceCard({ title, description, icon }: ServiceCardProps) {
  return (
    <div className="glass-card p-xl flex flex-col gap-md">
      {icon && <div className="text-surgical-teal text-heading-1">{icon}</div>}
      <h3 className="text-heading-2 text-neutral-light font-heading">{title}</h3>
      <p className="text-body-regular text-neutral-medium leading-relaxed">{description}</p>
    </div>
  );
}
```

### Dynamic Grid Wrapper (ResponsiveGrid.tsx)

```typescript
import React from "react";

interface ResponsiveGridProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export function ResponsiveGrid<T>({ items, renderItem }: ResponsiveGridProps<T>) {
  return (
    <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-2xl w-full">
      {items.map((item, idx) => (
        <div key={idx}>{renderItem(item)}</div>
      ))}
    </div>
  );
}
```

---

## 11. Configuration Setup

### tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      mobile: "320px",
      tablet: "641px",
      desktop: "1025px",
      "ultra-wide": "1441px",
    },
    extend: {
      colors: {
        "dark-elevated": "#0F172A",
        "surgical-teal": {
          DEFAULT: "#14B8A6",
          dark: "#0D9488",
        },
        neutral: {
          light: "#F8FAFC",
          medium: "#94A3B8",
          dark: "#1E293B",
        },
        status: {
          green: "#10B981",
          amber: "#F59E0B",
          red: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-poppins)", "sans-serif"],
        mono: ["var(--font-fira-code)", "monospace"],
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "56px", fontWeight: "700" }],
        "display-md": ["36px", { lineHeight: "44px", fontWeight: "700" }],
        "heading-1": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "heading-2": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "heading-3": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-regular": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-small": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
      boxShadow: {
        glass: "0 10px 30px 0 rgba(0, 0, 0, 0.35)",
      },
      zIndex: {
        dropdown: "1000",
        sticky: "1020",
        fixed: "1030",
        "modal-backdrop": "1040",
        modal: "1050",
        popover: "1060",
        tooltip: "1070",
      },
    },
  },
  plugins: [],
};

export default config;
```

> **Implementation note**: In this repository, the `neutral-*` and status colors are declared as flat tokens (`neutral-light`, `success-green`, `error-red`, …) because existing components already use those class names extensively. The nested `status.green` / `status.amber` / `status.red` aliases from the spec above are also available.

---

## 12. Design System v2.0 — HealthNet × Dr. Herlon Moura (NEW)

Section 12 documents the current **v2.0** token layer that ships in `app/globals.css` and `tailwind.config.ts`, and the showcase route at **`/v2`** (`app/v2/page.tsx`). The v1 documentation in sections 1–11 above is preserved for the legacy glassmorphism components; new work should use the v2.0 tokens.

### 12.1 Route: `/v2`

- **URL**: `http://localhost:3000/v2` (`npm run dev`); static-exported as `out/v2.html`.
- **File**: `app/v2/page.tsx` — a client component showcase: hero, full color palette (light + dark swatches with token names), typography scale (12/14/16/20/24/32/44/56px in Inter/Montserrat), button variants (primary blue + gold accent), and card components.
- **Theme toggle**: the shared `ThemeToggle` switches `[data-theme]` between `"light"` and `"dark"` on `<html>` (and keeps the Tailwind `dark` class in sync — see 12.4).

### 12.2 Global base colors (`--g-color-*`)

Light mode is the **default** (`:root`); dark mode is the **override** (`[data-theme="dark"]`).

| Token | Light | Dark | Name |
|-------|-------|------|------|
| `g-color-base-primary` | `#0A2540` | `#F4F7F6` | Deep Navy → Soft Off-White |
| `g-color-base-secondary` | `#206095` | `#4A90E2` | Vascular Blue → Lighter Blue |
| `g-color-accent` | `#C5A880` | `#D4B88E` | Champagne Gold → Lighter Gold |
| `g-color-surface-light` | `#F8F9FA` | `#121A21` | Page canvas |
| `g-color-surface-card` | `#FFFFFF` | `#1A242F` | Elevated card BG |
| `g-color-text-main` | `#1A2B3C` | `#E2E8F0` | Dark Slate → Light text |
| `g-color-text-muted` | `#5A6B7C` | `#94A3B8` | Muted text |
| `g-color-border-subtle` | `#E2E8F0` | `#2A3A4A` | Subtle borders |

Additional light-default tokens defined in `:root`: `--g-color-text-inverse`, `--g-color-text-dim`, `--g-color-border-strong`, accent variants (`-light`/`-dark`), primary variants (`-dim`/`-bright`), surface variants (`-raised`/`-overlay`/`-card-hover`), status colors, and glassmorphism tokens.

### 12.3 Typography

- **Family**: `'Inter', 'Montserrat', sans-serif`; weights 400 / 500 / 600 / 700.
- Fonts load via `next/font/google` in `app/layout.tsx` (`--font-inter`, `--font-montserrat` CSS variables); the `/v2` page uses both in its inline font stack.

| Token | Size | Rem |
|-------|------|-----|
| `g-font-size-xs` | 12px | 0.75rem |
| `g-font-size-sm` | 14px | 0.875rem |
| `g-font-size-base` | 16px | 1.0rem |
| `g-font-size-md` | 20px | 1.25rem |
| `g-font-size-lg` | 24px | 1.5rem |
| `g-font-size-xl` | 32px | 2.0rem |
| `g-font-size-2xl` | 44px | 2.75rem |
| `g-font-size-3xl` | 56px | 3.5rem |

### 12.4 Semantic tokens (`--s-color-*`)

Defined in `:root` referencing the base tokens; dark values are overridden in `[data-theme="dark"]` so they auto-switch with the theme:

| Token | Light | Dark |
|-------|-------|------|
| `s-color-bg-canvas` | `g-color-surface-light` | `#121A21` |
| `s-color-bg-surface` | `g-color-surface-card` | `#1A242F` |
| `s-color-bg-brand` | `g-color-base-primary` | `#F4F7F6` |
| `s-color-bg-accent` | `g-color-accent` | `g-color-accent` |
| `s-color-content-heading` | `g-color-base-primary` | `g-color-text-main` |
| `s-color-content-body` | `g-color-text-main` | `g-color-text-muted` |
| `s-color-content-muted` | `g-color-text-muted` | `g-color-text-muted` |
| `s-color-content-inverse` | `g-color-surface-card` | `g-color-base-primary` |
| `s-color-action-primary` | `g-color-base-secondary` | `g-color-base-secondary` |
| `s-color-action-hover` | `#174872` | `#357ABD` |
| `s-color-action-gold` | `g-color-accent` | `g-color-accent` |

**Theme system sync**: `ThemeProvider` (and the inline init script in `app/layout.tsx`) set **both** the Tailwind `light`/`dark` class **and** `data-theme="light"|"dark"` on `<html>`, so the class-based dark mode used by legacy components and the attribute-based v2.0 theme stay in sync. Persisted under `localStorage['herlonmoura-theme']`; `<html>` carries `suppressHydrationWarning`.

### 12.5 Component tokens (`--c-*`)

| Token | Value |
|-------|-------|
| `c-button-primary-bg` | `s-color-action-primary` |
| `c-button-primary-text` | `#FFFFFF` |
| `c-button-gold-bg` | `g-color-accent` |
| `c-button-gold-text` | `g-color-base-primary` |
| `c-button-radius` | `6px` |
| `c-card-bg` | `s-color-bg-surface` |
| `c-card-border` | `g-color-border-subtle` |
| `c-card-radius` | `12px` |
| `c-card-shadow` | light: `0 4px 20px rgba(10,37,64,0.06)` · dark: `0 4px 20px rgba(0,0,0,0.4)` |

The user-specified shorthand aliases (`--bg-canvas`, `--bg-surface`, `--text-heading`, `--text-body`, `--text-muted`, `--brand-primary`, `--brand-secondary`, `--accent-gold`, `--border-subtle`, `--card-shadow`) are also defined in `:root` / `[data-theme="dark"]` and mirror the values above.

### 12.6 Reference CSS (exact v2.0 implementation)

```css
:root {
  --bg-canvas: #F8F9FA; --bg-surface: #FFFFFF; --text-heading: #0A2540;
  --text-body: #1A2B3C; --text-muted: #5A6B7C; --brand-primary: #0A2540;
  --brand-secondary: #206095; --accent-gold: #C5A880; --border-subtle: #E2E8F0;
  --card-shadow: 0 4px 20px rgba(10,37,64,0.06);
}
[data-theme="dark"] {
  --bg-canvas: #121A21; --bg-surface: #1A242F; --text-heading: #F4F7F6;
  --text-body: #E2E8F0; --text-muted: #94A3B8; --brand-primary: #F4F7F6;
  --brand-secondary: #4A90E2; --accent-gold: #D4B88E; --border-subtle: #2A3A4A;
  --card-shadow: 0 4px 20px rgba(0,0,0,0.4);
}
```

> **Implementation note**: The dark block is written as `[data-theme="dark"], :root.dark` in `app/globals.css` so it also fires for the class-based dark mode kept for legacy components. Light is the default (`:root`), per the v2.0 spec.
