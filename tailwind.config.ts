import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
      backgroundColor: {
        glass: "rgba(15, 23, 42, 0.7)",
        "glass-hover": "rgba(15, 23, 42, 0.8)",
      },
      borderColor: {
        glass: "rgba(20, 184, 166, 0.2)",
        "glass-hover": "rgba(20, 184, 166, 0.4)",
      },
      backdropFilter: {
        glass: "blur(10px)",
      },
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
      screens: {
        mobile: "320px",
        tablet: "641px",
        desktop: "1025px",
        "ultra-wide": "1441px",
      },
      maxWidth: {
        container: "1440px",
      },
      boxShadow: {
        glass: "0 10px 30px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-in-out",
        "slide-up": "slideUp 1s ease-out",
        "scale-in": "scaleIn 0.6s ease-out",
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
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};

export default config;
