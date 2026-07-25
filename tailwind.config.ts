import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        "ink-muted": "var(--color-ink-muted)",
        paper: "var(--color-paper)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
        "accent-light": "var(--color-accent-light)",
        gold: "var(--color-gold)",
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
