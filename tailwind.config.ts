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
         Adapted from ui-ux-pro-max design-system skill
         ============================================ */

      /* === SEMANTIC COLORS (mapped to CSS variables) === */
      colors: {
        /* Semantic - mapped to :root CSS variables */
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        /* Primary - Medical Teal */
        primary: {
          DEFAULT: 'hsl(var(--color-primary))',
          foreground: 'hsl(var(--color-primary-foreground))',
        },
        /* Secondary - Medical Emerald */
        secondary: {
          DEFAULT: 'hsl(var(--color-secondary))',
          foreground: 'hsl(var(--color-secondary-foreground))',
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

        /* Medical Brand Colors (HSL for opacity support) */
        surgical: {
          teal: {
            DEFAULT: 'hsl(174 84% 48%)',    /* #14B8A6 */
            dark: 'hsl(174 84% 36%)',      /* #0D9488 */
            light: 'hsl(175 72% 60%)',
          },
          emerald: {
            DEFAULT: 'hsl(160 84% 40%)',   /* #10B981 */
            dark: 'hsl(160 84% 30%)',      /* #059669 */
          },
        },

        /* Status Colors */
        success: {
          DEFAULT: 'hsl(160 84% 35%)',     /* #10B981 */
          foreground: 'hsl(0 0% 100%)',
        },
        warning: {
          DEFAULT: 'hsl(43 76% 49%)',      /* #F59E0B */
          foreground: 'hsl(0 0% 100%)',
        },
        error: {
          DEFAULT: 'hsl(0 94% 58%)',       /* #EF4444 */
          foreground: 'hsl(0 0% 100%)',
        },

        /* Neutral (for backward compat with existing classes) */
        'neutral-light': 'var(--color-neutral-light)',
        'neutral-medium': 'var(--color-neutral-medium)',
        'neutral-dark': 'var(--color-neutral-dark)',

        /* Hover variants — mapped to CSS variables for theme switching */
        'primary-hover': 'hsl(var(--color-primary-hover))',
        'secondary-hover': 'hsl(var(--color-secondary-hover))',
        'primary-foreground': 'hsl(var(--color-primary-foreground))',
        'secondary-foreground': 'hsl(var(--color-secondary-foreground))',
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
        heading: ["var(--font-poppins)", "Poppins", "system-ui", "sans-serif"],
        mono: ["var(--font-fira-code)", "Fira Code", "monospace"],
      },

      /* === BACKGROUND COLORS (theme-aware) === */
      backgroundColor: {
        glass: "rgba(255, 255, 255, 0.3)",
        'glass-hover': "rgba(255, 255, 255, 0.5)",
        'glass-overlay': "rgba(255, 255, 255, 0.2)",
      },

      /* === BORDER COLORS === */
      borderColor: {
        glass: "rgba(20, 184, 166, 0.2)",
        'glass-hover': "rgba(20, 184, 166, 0.4)",
      },

      /* === BACKDROP FILTERS === */
      backdropFilter: {
        glass: "blur(12px)",
      },

      /* === SPACING SCALE === */
      spacing: {
        xs: "0.25rem",    /* 4px */
        sm: "0.5rem",     /* 8px */
        md: "0.75rem",    /* 12px */
        lg: "1rem",       /* 16px */
        xl: "1.5rem",     /* 24px */
        '2xl': "2rem",    /* 32px */
        '3xl': "3rem",    /* 48px */
        '4xl': "4rem",    /* 64px */
        '5xl': "5rem",    /* 80px */
      },

      /* === TYPOGRAPHY SCALE === */
      fontSize: {
        'display-lg': ["2.25rem", { lineHeight: "2.5rem", fontWeight: "800" }], /* 36px → responsive */
        'display-md': ["1.875rem", { lineHeight: "2.25rem", fontWeight: "800" }], /* 30px */
        'heading-1': ["1.5rem", { lineHeight: "2rem", fontWeight: "700" }],   /* 24px */
        'heading-2': ["1.25rem", { lineHeight: "1.75rem", fontWeight: "600" }], /* 20px */
        'heading-3': ["1.125rem", { lineHeight: "1.5rem", fontWeight: "600" }], /* 18px */
        'body-lg': ["1.125rem", { lineHeight: "1.75rem", fontWeight: "400" }], /* 18px */
        'body-regular': ["1rem", { lineHeight: "1.625rem", fontWeight: "400" }], /* 16px */
        'body-small': ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }], /* 14px */
        caption: ["0.75rem", { lineHeight: "1rem", fontWeight: "500" }], /* 12px */
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
        container: "1440px",
      },

      /* === SHADOWS === */
      boxShadow: {
        glass: "0 10px 30px 0 rgba(0, 0, 0, 0.35)",
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        '2xl': "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      },

      /* === BORDER RADIUS === */
      borderRadius: {
        sm: "0.125rem",    /* 2px */
        md: "0.375rem",    /* 6px */
        lg: "0.5rem",      /* 8px */
        xl: "0.75rem",     /* 12px */
        '2xl': "1rem",     /* 16px */
        '3xl': "1.5rem",   /* 24px */
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

      /* === ANIMATIONS & KEYFRAMES === */
      animation: {
        'fade-in': "fadeIn 0.8s ease-in-out",
        'slide-up': "slideUp 1s ease-out",
        'slide-down': "slideDown 1s ease-out",
        'slide-left': "slideLeft 1s ease-out",
        'slide-right': "slideRight 1s ease-out",
        'scale-in': "scaleIn 0.6s ease-out",
        'pulse-custom': "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
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
