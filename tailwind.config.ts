import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      // ============================================
      // v2.0 HEALTHNET × DR. HERLON MOURA COLOR PALETTE
      // ============================================
      colors: {
        // --- v2.0 Primitive Brand Colors ---
        // HealthNet brand palette — mapped to CSS variables for theming
        primary: {
          DEFAULT: "var(--g-color-base-primary)",     /* Navy white / deep navy */
          dark: "var(--g-color-base-primary-bright)",
          foreground: "var(--g-color-text-inverse)",
        },
        secondary: {
          DEFAULT: "var(--g-color-base-secondary)",   /* Vibrant blue */
          dark: "var(--g-color-base-secondary)",
          foreground: "var(--g-color-text-inverse)",
        },
        accent: {
          DEFAULT: "var(--g-color-accent)",             /* Gold/amber */
          dark: "var(--g-color-accent-dark)",
          foreground: "var(--g-color-base-primary)",
        },

        // --- v2.0 Semantic Color Groups ---
        // Surface colors
        surface: {
          light: "var(--g-color-surface-light)",
          card: "var(--g-color-surface-card)",
          raised: "var(--g-color-surface-raised)",
          overlay: "var(--g-color-surface-overlay)",
          "card-hover": "var(--g-color-surface-card-hover)",
          dark: "#0B0F19",
          cardDark: "#1E293B",
        },

        // Text colors
        text: {
          main: "var(--g-color-text-main)",
          muted: "var(--g-color-text-muted)",
          dim: "var(--g-color-text-dim)",
          inverse: "var(--g-color-text-inverse)",
        },

        // Border colors
        border: {
          DEFAULT: "var(--border)",
          subtle: "var(--g-color-border-subtle)",
          strong: "var(--g-color-border-strong)",
        },

        // Status colors
        status: {
          green: "var(--g-color-success)",
          amber: "var(--g-color-warning)",
          red: "var(--g-color-error)",
          yellow: "var(--g-color-warning)",
          blue: "var(--g-color-base-secondary)",
        },

        // --- Legacy compatibility: maps to v2.0 via CSS variables ---
        // These maintain backward compatibility with existing component classes
        "dark-elevated": "var(--color-dark-elevated)",
        "surgical-teal": {
          DEFAULT: "var(--color-surgical-teal)",
          dark: "var(--color-surgical-teal-dark)",
        },
        "neutral": {
          light: "var(--color-neutral-light)",
          medium: "var(--color-neutral-medium)",
          dark: "var(--color-neutral-dark)",
        },
        "success-green": "var(--color-success-green)",
        "warning-amber": "var(--color-warning-amber)",
        "error-red": "var(--color-error-red)",

        // --- Legacy medical accent (now maps to v2.0 primary) ---
        "medical-teal": "var(--color-medical-teal)",
        "medical-soft": "var(--color-medical-soft)",

        // --- Admin redesign tokens ---
        brand: {
          DEFAULT: "#111827",
          accent: "#E6FF57",
          muted: "#9CA3AF",
        },
        medical: {
          purple: "#E2E8F0",
          blue: "#E0F2FE",
          yellow: "#FEF9C3",
          teal: "#CCFBF1",
        },

        // --- Legacy earth accent (now maps to v2.0 accent) ---
        earth: "var(--color-earth)",
        "earth-light": "var(--color-earth-light)",

        // --- Legacy semantic aliases ---
        "bg-primary": "var(--color-bg-primary)",
        "bg-secondary": "var(--color-bg-secondary)",
        "bg-tertiary": "var(--color-bg-tertiary)",
        "bg-card": "var(--color-bg-card)",
        "bg-card-hover": "var(--color-bg-card-hover)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-tertiary": "var(--color-text-tertiary)",
        "text-inverse": "var(--color-text-inverse)",
        "border-default": "var(--color-border-default)",
        "border-subtle": "var(--color-border-subtle)",
        "border-strong": "var(--color-border-strong)",

        // v2.0 Gold/amber as Tailwind-accessible names
        gold: {
          DEFAULT: "var(--g-color-accent)",
          light: "var(--g-color-accent-light)",
          dark: "var(--g-color-accent-dark)",
        },

        // v2.0 Navy as Tailwind-accessible names
        navy: {
          DEFAULT: "var(--g-color-base-primary-dim)",
          dark: "var(--g-color-base-primary)",
        },

        // ============================================
        // shadcn/ui semantic colors (must live under
        // colors so bg-background/text-foreground etc.
        // resolve — Tailwind v3 does not read
        // theme.extend.background as a color).
        // NOTE: primary/secondary/accent are merged
        // into the v2.0 groups above (with .foreground);
        // "border" is merged into the v2.0 border group.
        // ============================================
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: "var(--destructive)",
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },

      // ============================================
      // BACKGROUND COLORS
      // ============================================
      backgroundColor: {
        glass: "var(--g-color-glass-surface)",
        "glass-hover": "var(--g-color-glass-surface-hover)",
        "glass-overlay": "var(--g-color-glass-overlay)",
      },

      // ============================================
      // BORDER COLORS
      // ============================================
      borderColor: {
        glass: "var(--g-color-glass-border)",
        "glass-hover": "var(--g-color-glass-border-hover)",
      },

      // ============================================
      // BACKDROP FILTERS
      // ============================================
      backdropFilter: {
        glass: "blur(12px)",
      },

      // ============================================
      // FONT STACKS
      // v2.0: Inter = body copy, Montserrat = headings.
      // Every entry MUST terminate in a real generic family
      // (sans-serif/monospace). A stack whose only fallback is a
      // named font with no @font-face resolves to the UA default
      // serif — that was the bug behind the "Times New Roman" h1.
      // ============================================
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "sans-serif"],
        heading: ["var(--font-montserrat)", "var(--font-inter)", "system-ui", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        poppins: ["var(--font-poppins)", "var(--font-montserrat)", "system-ui", "sans-serif"],
        mono: ["var(--font-fira-code)", "ui-monospace", "monospace"],
      },

      // ============================================
      // SPACING SCALE (4px base grid)
      // ============================================
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "48px",
        "4xl": "64px",
        "5xl": "80px",
      },

      // ============================================
      // TYPOGRAPHY SCALE (12px to 56px)
      // ============================================
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

      // ============================================
      // RESPONSIVE BREAKPOINTS
      // ============================================
      screens: {
        mobile: "320px",
        tablet: "641px",
        desktop: "1025px",
        "ultra-wide": "1441px",
      },

      // ============================================
      // MAX WIDTH CONSTRAINTS
      // ============================================
      maxWidth: {
        container: "1440px",
      },

      // ============================================
      // SHADOWS
      // ============================================
      boxShadow: {
        glass: "var(--shadow-glass)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        card: "var(--shadow-card)",
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
      },

      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",      /* v2.0: card radius */
        xl: "16px",
        button: "6px",   /* v2.0: all buttons use 6px radius */
        "2xl": "1rem",
        "3xl": "1.5rem",
      },

      // ============================================
      // TRANSITIONS
      // ============================================
      transitionTimingFunction: {
        "in-out-material": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "300ms",
        slow: "500ms",
      },

      // ============================================
      // ANIMATIONS & KEYFRAMES
      // ============================================
      animation: {
        "fade-in": "fadeIn 0.8s ease-in-out",
        "slide-up": "slideUp 1s ease-out",
        "slide-down": "slideDown 1s ease-out",
        "slide-left": "slideLeft 1s ease-out",
        "slide-right": "slideRight 1s ease-out",
        "scale-in": "scaleIn 0.6s ease-out",
        "pulse-custom": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideLeft: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },

      // ============================================
      // Z-INDEX SCALE
      // ============================================
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
