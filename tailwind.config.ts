import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ['class'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ============================================
         DESIGN SYSTEM: THREE-LAYER TOKENS
         (primitive → semantic → component)
         Brand palette extracted from herlonmoura.com.br
         ============================================ */

      /* === SEMANTIC COLORS (mapped to CSS variables) === */
      colors: {
        /* Semantic - mapped to :root CSS variables */
        background: 'hsl(var(--color-background))',
        foreground: 'hsl(var(--color-foreground))',

        /* Primary - Medical Navy Blue (from live site) */
        primary: {
          DEFAULT: 'hsl(var(--color-primary))',
          foreground: 'hsl(var(--color-primary-foreground))',
          hover: 'hsl(var(--color-primary-hover))',
          active: 'hsl(var(--color-primary-active))',
        },
        /* Secondary - Medical Sky Blue (from live site) */
        secondary: {
          DEFAULT: 'hsl(var(--color-secondary))',
          foreground: 'hsl(var(--color-secondary-foreground))',
          hover: 'hsl(var(--color-secondary-hover))',
        },

        /* Card */
        card: {
          DEFAULT: 'hsl(var(--color-card))',
          foreground: 'hsl(var(--color-card-foreground))',
        },

        /* Popover */
        popover: {
          DEFAULT: 'hsl(var(--color-popover))',
          foreground: 'hsl(var(--color-popover-foreground))',
        },

        /* Muted */
        muted: {
          DEFAULT: 'hsl(var(--color-muted))',
          foreground: 'hsl(var(--color-muted-foreground))',
        },

        /* Accent */
        accent: {
          DEFAULT: 'hsl(var(--color-accent))',
          foreground: 'hsl(var(--color-accent-foreground))',
        },

        /* Destructive */
        destructive: {
          DEFAULT: 'hsl(var(--color-destructive))',
          foreground: 'hsl(var(--color-destructive-foreground))',
        },

        /* Borders & Rings */
        border: 'hsl(var(--color-border))',
        input: 'hsl(var(--color-input))',
        ring: 'hsl(var(--color-ring))',

        /* Brand Palette (from herlonmoura.com.br) */
        brand: {
          navy: {
            DEFAULT: '#1D3C73',
            light: '#2A4F8F',
            dark: '#152D54',
          },
          sky: {
            DEFAULT: '#68A9F2',
            light: '#8FC4F7',
            dark: '#4A8FE0',
          },
          taupe: {
            DEFAULT: '#A4978E',
            light: '#C4B8AF',
            dark: '#8A7D74',
          },
        },

        /* Status Colors */
        success: {
          DEFAULT: 'hsl(160 84% 35%)',
          foreground: 'hsl(0 0% 100%)',
        },
        warning: {
          DEFAULT: 'hsl(43 76% 49%)',
          foreground: 'hsl(0 0% 100%)',
        },
        error: {
          DEFAULT: 'hsl(0 94% 58%)',
          foreground: 'hsl(0 0% 100%)',
        },

        /* Neutral (for backward compat with existing classes) */
        'neutral-light': 'var(--color-neutral-light)',
        'neutral-medium': 'var(--color-neutral-medium)',
        'neutral-dark': 'var(--color-neutral-dark)',

        /* Tertiary - Taupe (buttons on dark backgrounds, from live site) */
        tertiary: 'hsl(var(--color-tertiary))',
        'tertiary-hover': 'hsl(var(--color-tertiary-hover))',
        'tertiary-foreground': 'hsl(var(--color-tertiary-foreground))',
      },

      /* === FONT STACKS === */
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        heading: [
          "var(--font-lexend)",
          "Lexend",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-fira-code)", "Fira Code", "monospace"],
      },

      /* === SPACING SCALE === */
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        '2xl': "2rem",
        '3xl': "3rem",
        '4xl': "4rem",
        '5xl': "5rem",
      },

      /* === TYPOGRAPHY SCALE === */
      fontSize: {
        'display-xl': ["3.5rem", { lineHeight: "1.1", fontWeight: "700" }],
        'display-lg': ["2.75rem", { lineHeight: "1.15", fontWeight: "700" }],
        'display-md': ["2.25rem", { lineHeight: "1.2", fontWeight: "700" }],
        'heading-1': ["1.875rem", { lineHeight: "2.25rem", fontWeight: "700" }],
        'heading-2': ["1.5rem", { lineHeight: "2rem", fontWeight: "600" }],
        'heading-3': ["1.25rem", { lineHeight: "1.75rem", fontWeight: "600" }],
        'body-lg': ["1.125rem", { lineHeight: "1.75rem", fontWeight: "400" }],
        'body-regular': ["1rem", { lineHeight: "1.625rem", fontWeight: "400" }],
        'body-small': ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }],
        caption: ["0.75rem", { lineHeight: "1rem", fontWeight: "500" }],
      },

      /* === RESPONSIVE BREAKPOINTS === */
      screens: {
        mobile: "320px",
        tablet: "641px",
        desktop: "1025px",
        'ultra-wide': "1441px",
      },

      /* === MAX WIDTH CONSTRAINTS === */
      maxWidth: {
        container: "1200px",
      },

      /* === SHADOWS === */
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        '2xl': "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      },

      /* === BORDER RADIUS (matches live site - subtle 3px) === */
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "3px",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        '2xl': "1rem",
        '3xl': "1.5rem",
        full: "9999px",
      },

      /* === TRANSITIONS === */
      transitionTimingFunction: {
        'in-out-material': "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "300ms",
        slow: "500ms",
      },

      /* === Z-INDEX SCALE === */
      zIndex: {
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        'modal-backdrop': '1040',
        modal: '1050',
        popover: '1060',
        tooltip: '1070',
      },
    },
  },
  plugins: [],
};

export default config;
