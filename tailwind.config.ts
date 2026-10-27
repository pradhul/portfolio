import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: {
          DEFAULT: "#050b14",
          soft: "#0a1322",
          raised: "#0e1b30",
        },
        cream: {
          DEFAULT: "#e6edf7",
          muted: "#b5ccf2",
          faint: "#8fb0e0",
        },
        lime: {
          DEFAULT: "#eaff52",
          bright: "#f4ffa0",
          dim: "#c6d93a",
        },
        brass: {
          DEFAULT: "#e5a93c",
          bright: "#f0c06a",
          dim: "#c48d28",
        },
        signal: "#00e887",
        line: "#22385c",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        schematic: "1180px",
      },
    },
  },
  plugins: [],
} satisfies Config;
