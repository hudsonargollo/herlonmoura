# Design System Documentation

## Overview

This document provides a comprehensive reference for the Dr. Herlon Moura Medical Website design system. All design tokens are configured in Tailwind CSS and CSS custom properties for consistent, scalable styling across the application.

---

## Color Palette

### Primary Colors

| Token | Value | Usage |
|-------|-------|-------|
| `dark-elevated` | `#0F172A` | Primary background color, dark mode base |
| `surgical-teal` | `#14B8A6` | Primary accent color, interactive elements |
| `surgical-teal-dark` | `#0D9488` | Hover state for surgical teal elements |

**CSS Variables**:
```css
--color-dark-elevated: #0f172a;
--color-surgical-teal: #14b8a6;
--color-surgical-teal-dark: #0d9488;
```

**Tailwind Classes**:
```html
<!-- Background -->
<div class="bg-dark-elevated">Dark elevated background</div>
<div class="bg-surgical-teal">Surgical teal background</div>

<!-- Text -->
<p class="text-surgical-teal">Surgical teal text</p>

<!-- Border -->
<div class="border-surgical-teal">Surgical teal border</div>
```

### Supporting Colors

| Token | Value | Usage |
|-------|-------|-------|
| `neutral-light` | `#F8FAFC` | Light text, borders on dark backgrounds |
| `neutral-medium` | `#94A3B8` | Secondary text, disabled states |
| `neutral-dark` | `#1E293B` | Elevated surfaces, cards |
| `success-green` | `#10B981` | Positive outcomes, confirmations |
| `warning-amber` | `#F59E0B` | Cautions, important notices |
| `error-red` | `#EF4444` | Errors, critical alerts |

**CSS Variables**:
```css
--color-neutral-light: #f8fafc;
--color-neutral-medium: #94a3b8;
--color-neutral-dark: #1e293b;
--color-success-green: #10b981;
--color-warning-amber: #f59e0b;
--color-error-red: #ef4444;
```

### Glassmorphism Colors

| Token | Value | Usage |
|-------|-------|-------|
| `glass` (bg) | `rgba(15, 23, 42, 0.7)` | Glass surface background |
| `glass-hover` (bg) | `rgba(15, 23, 42, 0.8)` | Glass surface on hover |
| `glass` (border) | `rgba(20, 184, 166, 0.2)` | Glass surface border |
| `glass-hover` (border) | `rgba(20, 184, 166, 0.4)` | Glass surface border on hover |
| `glass-overlay` | `rgba(15, 23, 42, 0.4)` | Semi-transparent overlay |

**CSS Variables**:
```css
--color-glass-surface: rgba(15, 23, 42, 0.7);
--color-glass-surface-hover: rgba(15, 23, 42, 0.8);
--color-glass-border: rgba(20, 184, 166, 0.2);
--color-glass-border-hover: rgba(20, 184, 166, 0.4);
--color-glass-overlay: rgba(15, 23, 42, 0.4);
```

**Tailwind Classes**:
```html
<!-- Glassmorphism effect -->
<div class="bg-glass border-glass backdrop-blur-[10px]">Glass effect</div>

<!-- Glass card component -->
<div class="glass-card">Glass card with shadow</div>
```

---

## Typography System

### Font Stack

**Primary Font**: `Inter` (system fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`)
**Heading Font**: `Poppins` (system fallback: `Inter`)
**Monospace**: `Fira Code` (for code blocks)

### Type Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `display-lg` | 48px | 56px | 700 | Hero headlines |
| `display-md` | 36px | 44px | 700 | Section titles |
| `heading-1` | 32px | 40px | 600 | Page titles |
| `heading-2` | 24px | 32px | 600 | Section headers |
| `heading-3` | 20px | 28px | 600 | Subsection headers |
| `body-lg` | 18px | 28px | 400 | Large body text |
| `body-regular` | 16px | 24px | 400 | Standard body text |
| `body-small` | 14px | 20px | 400 | Secondary text |
| `caption` | 12px | 16px | 500 | Labels, captions |

**CSS Variables**:
```css
--font-display-lg: 48px;
--font-display-md: 36px;
--font-heading-1: 32px;
--font-heading-2: 24px;
--font-heading-3: 20px;
--font-body-lg: 18px;
--font-body-regular: 16px;
--font-body-small: 14px;
--font-caption: 12px;
```

**Tailwind Classes**:
```html
<h1 class="text-display-lg">Hero Headline</h1>
<h2 class="text-display-md">Section Title</h2>
<h3 class="text-heading-1">Page Title</h3>
<p class="text-body-regular">Body text</p>
<small class="text-caption">Caption text</small>
```

---

## Spacing Scale

All spacing values are based on a 4px base unit.

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Minimal spacing |
| `sm` | 8px | Small spacing |
| `md` | 12px | Medium spacing |
| `lg` | 16px | Standard spacing |
| `xl` | 24px | Large spacing |
| `2xl` | 32px | Extra large spacing |
| `3xl` | 48px | 3x large spacing |
| `4xl` | 64px | 4x large spacing |
| `5xl` | 80px | 5x large spacing |

**CSS Variables**:
```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;
--spacing-2xl: 32px;
--spacing-3xl: 48px;
--spacing-4xl: 64px;
--spacing-5xl: 80px;
```

**Tailwind Classes**:
```html
<!-- Padding -->
<div class="p-lg">Padding large</div>
<div class="px-xl py-lg">Padding X and Y</div>

<!-- Margin -->
<div class="m-md">Margin medium</div>
<div class="mb-xl">Margin bottom extra large</div>

<!-- Gap (Flexbox/Grid) -->
<div class="flex gap-lg">Flex with gap</div>
<div class="grid gap-2xl">Grid with gap</div>
```

---

## Responsive Breakpoints

| Token | Width | Device | Usage |
|-------|-------|--------|-------|
| `mobile` | 320px | Mobile phones | Small screens |
| `tablet` | 641px | Tablets | Medium screens |
| `desktop` | 1025px | Desktop computers | Large screens |
| `ultra-wide` | 1441px | Ultra-wide displays | Extra large screens |

**CSS Variables**:
```css
--breakpoint-mobile: 320px;
--breakpoint-tablet: 641px;
--breakpoint-desktop: 1025px;
--breakpoint-ultra-wide: 1441px;
```

**Tailwind Classes**:
```html
<!-- Mobile-first responsive design -->
<div class="text-body-small tablet:text-body-regular desktop:text-body-lg">
  Responsive text size
</div>

<div class="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3">
  Responsive grid
</div>

<div class="px-md tablet:px-lg desktop:px-xl">
  Responsive padding
</div>
```

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `glass` | `0 10px 30px rgba(0, 0, 0, 0.3)` | Glass effect shadow |
| `sm` | `0 1px 2px rgba(0, 0, 0, 0.05)` | Small shadow |
| `md` | `0 4px 6px rgba(0, 0, 0, 0.1)` | Medium shadow |
| `lg` | `0 10px 15px rgba(0, 0, 0, 0.1)` | Large shadow |

**CSS Variables**:
```css
--shadow-glass: 0 10px 30px rgba(0, 0, 0, 0.3);
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
```

**Tailwind Classes**:
```html
<div class="shadow-glass">Glass shadow</div>
<div class="shadow-sm">Small shadow</div>
<div class="shadow-md">Medium shadow</div>
<div class="shadow-lg">Large shadow</div>
```

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 4px | Small radius |
| `md` | 8px | Medium radius |
| `lg` | 12px | Large radius |
| `xl` | 16px | Extra large radius |

**CSS Variables**:
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
```

**Tailwind Classes**:
```html
<div class="rounded-sm">Small radius</div>
<div class="rounded-md">Medium radius</div>
<div class="rounded-lg">Large radius</div>
<div class="rounded-xl">Extra large radius</div>
```

---

## Transitions

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `fast` | 150ms | ease-in-out | Quick transitions |
| `base` | 300ms | ease-in-out | Standard transitions |
| `slow` | 500ms | ease-in-out | Slow transitions |

**CSS Variables**:
```css
--transition-fast: 150ms ease-in-out;
--transition-base: 300ms ease-in-out;
--transition-slow: 500ms ease-in-out;
```

**Tailwind Classes**:
```html
<div class="transition-all duration-fast">Fast transition</div>
<div class="transition-all duration-base">Base transition</div>
<div class="transition-all duration-slow">Slow transition</div>
```

---

## Animations

### Available Animations

| Animation | Duration | Usage |
|-----------|----------|-------|
| `fade-in` | 0.8s | Fade in effect |
| `slide-up` | 1s | Slide up effect |
| `slide-down` | 1s | Slide down effect |
| `slide-left` | 1s | Slide left effect |
| `slide-right` | 1s | Slide right effect |
| `scale-in` | 0.6s | Scale in effect |
| `pulse-custom` | 2s | Pulse effect |

**Tailwind Classes**:
```html
<div class="animate-fade-in">Fade in animation</div>
<div class="animate-slide-up">Slide up animation</div>
<div class="animate-scale-in">Scale in animation</div>
<div class="animate-pulse-custom">Pulse animation</div>
```

### Custom Animations with Framer Motion

For more complex animations, use Framer Motion:

```tsx
import { motion } from "framer-motion";

export function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      Animated content
    </motion.div>
  );
}
```

---

## Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `dropdown` | 1000 | Dropdown menus |
| `sticky` | 1020 | Sticky elements |
| `fixed` | 1030 | Fixed elements |
| `modal-backdrop` | 1040 | Modal backdrop |
| `modal` | 1050 | Modal dialogs |
| `popover` | 1060 | Popovers |
| `tooltip` | 1070 | Tooltips |

**Tailwind Classes**:
```html
<div class="z-dropdown">Dropdown</div>
<div class="z-sticky">Sticky element</div>
<div class="z-modal">Modal</div>
<div class="z-tooltip">Tooltip</div>
```

---

## Glassmorphism Effects

### Glass Card

```html
<div class="glass-card">
  <h3 class="text-heading-2">Glass Card</h3>
  <p class="text-body-regular">Content with glassmorphism effect</p>
</div>
```

### Glass Input

```html
<input type="text" class="glass-input" placeholder="Enter text..." />
```

### Glass Button

```html
<button class="glass-button">Click me</button>
```

### Custom Glass Effect

```html
<div class="rounded-xl border border-glass bg-glass backdrop-blur-[10px] shadow-glass">
  Custom glass effect
</div>
```

---

## Utility Classes

### Flexbox Helpers

```html
<!-- Center content -->
<div class="flex-center">Centered content</div>

<!-- Space between -->
<div class="flex-between">
  <span>Left</span>
  <span>Right</span>
</div>

<!-- Column center -->
<div class="flex-col-center">Vertically centered</div>
```

### Grid Helpers

```html
<!-- Auto-fit grid -->
<div class="grid-auto-fit">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Text Helpers

```html
<!-- Truncate text -->
<p class="text-truncate">Long text that will be truncated...</p>

<!-- Clamp to 2 lines -->
<p class="text-clamp-2">Multi-line text clamped to 2 lines...</p>

<!-- Clamp to 3 lines -->
<p class="text-clamp-3">Multi-line text clamped to 3 lines...</p>
```

### Screen Reader Only

```html
<span class="sr-only">Screen reader only text</span>
```

---

## Accessibility

### Color Contrast

All text meets WCAG 2.1 AA minimum contrast ratios:
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum

### Focus States

All interactive elements have visible focus indicators:

```html
<button class="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surgical-teal">
  Accessible button
</button>
```

### Reduced Motion

Animations respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Usage Examples

### Hero Section

```tsx
export function HeroSection() {
  return (
    <section className="flex-col-center min-h-screen gap-xl bg-dark-elevated px-lg py-5xl">
      <h1 className="text-display-lg text-neutral-light">Welcome</h1>
      <p className="text-body-lg text-neutral-medium">Subtitle</p>
      <button className="glass-button">Get Started</button>
    </section>
  );
}
```

### Card Component

```tsx
export function Card({ title, children }) {
  return (
    <div className="glass-card p-xl">
      <h3 className="text-heading-2 text-neutral-light">{title}</h3>
      <p className="mt-md text-body-regular text-neutral-medium">{children}</p>
    </div>
  );
}
```

### Responsive Grid

```tsx
export function ResponsiveGrid({ items }) {
  return (
    <div className="grid-auto-fit">
      {items.map((item) => (
        <div key={item.id} className="glass-card p-lg">
          {item.content}
        </div>
      ))}
    </div>
  );
}
```

---

## Best Practices

1. **Use Tailwind Classes**: Prefer Tailwind utility classes over custom CSS
2. **Consistent Spacing**: Use the spacing scale for all margins and padding
3. **Color Consistency**: Use defined colors from the palette
4. **Responsive Design**: Use mobile-first approach with breakpoint prefixes
5. **Accessibility**: Always include focus states and alt text
6. **Performance**: Use CSS custom properties for dynamic values
7. **Animations**: Use Framer Motion for complex animations, Tailwind for simple ones
8. **Documentation**: Keep this design system documentation updated

---

## Maintenance

This design system is maintained in:
- **Tailwind Config**: `tailwind.config.ts`
- **Global Styles**: `app/globals.css`
- **CSS Variables**: `:root` in `app/globals.css`

When updating the design system:
1. Update Tailwind configuration
2. Update CSS custom properties
3. Update this documentation
4. Test across all breakpoints
5. Verify accessibility compliance
