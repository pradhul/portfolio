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
          DEFAULT: "#0f0d0b",
          soft: "#171411",
          raised: "#1f1b17",
        },
        cream: {
          DEFAULT: "#ece5d8",
          muted: "#a89f8e",
          faint: "#6e675b",
        },
        brass: {
          DEFAULT: "#d9a441",
          bright: "#ecb955",
          dim: "#9a7430",
        },
        line: "rgba(236, 229, 216, 0.1)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
