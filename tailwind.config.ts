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
      // COLOR PALETTE — mapped to CSS variables
      // ============================================
      colors: {
        // Primary Colors
        "dark-elevated": "var(--color-dark-elevated)",
        "surgical-teal": {
          DEFAULT: "var(--color-surgical-teal)",
          dark: "var(--color-surgical-teal-dark)",
        },

        // Supporting Colors
        "neutral-light": "var(--color-neutral-light)",
        "neutral-medium": "var(--color-neutral-medium)",
        "neutral-dark": "var(--color-neutral-dark)",
        "success-green": "var(--color-success-green)",
        "warning-amber": "var(--color-warning-amber)",
        "error-red": "var(--color-error-red)",

        // Status group (alias)
        status: {
          green: "var(--color-success-green)",
          amber: "var(--color-warning-amber)",
          red: "var(--color-error-red)",
        },

        // ============================================
        // shadcn/ui semantic colors (mapped to CSS variables)
        // ============================================
        border: "var(--border)",
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
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
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

        // ============================================
        // SEMANTIC COLOR TOKENS
        // ============================================
        // Backgrounds
        "bg-primary": "var(--color-bg-primary)",
        "bg-secondary": "var(--color-bg-secondary)",
        "bg-tertiary": "var(--color-bg-tertiary)",
        "bg-card": "var(--color-bg-card)",
        "bg-card-hover": "var(--color-bg-card-hover)",

        // Text
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-tertiary": "var(--color-text-tertiary)",
        "text-inverse": "var(--color-text-inverse)",

        // Borders
        "border-default": "var(--color-border-default)",
        "border-subtle": "var(--color-border-subtle)",
        "border-strong": "var(--color-border-strong)",

        // Surfaces
        surface: "var(--color-surface)",
        "surface-raised": "var(--color-surface-raised)",
        "surface-overlay": "var(--color-surface-overlay)",
      },

      // ============================================
      // FONT STACKS
      // ============================================
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-geist)", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "sans-serif"],
        heading: ["var(--font-poppins)", "sans-serif"],
        mono: ["var(--font-fira-code)", "monospace"],
      },

      // ============================================
      // BACKGROUND COLORS
      // ============================================
      backgroundColor: {
        glass: "var(--color-glass-surface)",
        "glass-hover": "var(--color-glass-surface-hover)",
        "glass-overlay": "var(--color-glass-overlay)",
      },

      // ============================================
      // BORDER COLORS
      // ============================================
      borderColor: {
        glass: "var(--color-glass-border)",
        "glass-hover": "var(--color-glass-border-hover)",
      },

      // ============================================
      // BACKDROP FILTERS
      // ============================================
      backdropFilter: {
        glass: "blur(12px)",
      },

      // ============================================
      // SPACING SCALE
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
      // TYPOGRAPHY SCALE
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
      },

      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
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
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
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
