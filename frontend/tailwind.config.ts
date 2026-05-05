import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        surface: "#111118",
        border: "#1e1e2e",
        accent: "#6366f1",
        "accent-glow": "#818cf8",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".bg-grid-subtle": {
          backgroundImage:
            "linear-gradient(rgba(129, 140, 248, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(129, 140, 248, 0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        },
      });
    }),
  ],
};

export default config;
