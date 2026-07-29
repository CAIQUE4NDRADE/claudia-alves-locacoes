import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Base editorial — marfim quente, não o creme genérico #F4F1EA
        background: "#FBF7F1",
        surface: "#F3EBDD",
        surface2: "#EAE0CC",
        border: "#DED0B4",
        foreground: "#2A241E", // marrom-carvão, não preto puro
        muted: "#8C7E6A",
        // Dourado envelhecido (fosco, não brilhante) — assinatura da marca
        gold: {
          DEFAULT: "#A9813F",
          light: "#C9A264",
          dark: "#7C5E2C",
        },
        // Bordô profundo — contraste de confiança/luxo em CTAs e seções escuras
        bordo: {
          DEFAULT: "#6E1F2B",
          light: "#8C2B39",
          dark: "#48141C",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, #C9A264 0%, #7C5E2C 100%)",
        "gradient-bordo": "linear-gradient(135deg, #8C2B39 0%, #48141C 100%)",
      },
      boxShadow: {
        glow: "0 0 40px -12px rgba(169,129,63,0.35)",
        card: "0 14px 40px -18px rgba(42,36,30,0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
