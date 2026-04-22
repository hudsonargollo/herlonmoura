import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ============================================
      // COLOR PALETTE
      // ============================================
      colors: {
        // Primary Colors
        "dark-elevated": "#0F172A",
        "surgical-teal": "#14B8A6",
        "surgical-teal-dark": "#0D9488",

        // Supporting Colors
        "neutral-light": "#F8FAFC",
        "neutral-medium": "#94A3B8",
        "neutral-dark": "#1E293B",
        "success-green": "#10B981",
        "warning-amber": "#F59E0B",
        "error-red": "#EF4444",
      },

      // ============================================
      // BACKGROUND COLORS
      // ============================================
      backgroundColor: {
        glass: "rgba(15, 23, 42, 0.7)",
        "glass-hover": "rgba(15, 23, 42, 0.8)",
        "glass-overlay": "rgba(15, 23, 42, 0.4)",
      },

      // ============================================
      // BORDER COLORS
      // ============================================
      borderColor: {
        glass: "rgba(20, 184, 166, 0.2)",
        "glass-hover": "rgba(20, 184, 166, 0.4)",
      },

      // ============================================
      // BACKDROP FILTERS
      // ============================================
      backdropFilter: {
        glass: "blur(10px)",
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
        glass: "0 10px 30px rgba(0, 0, 0, 0.3)",
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
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
