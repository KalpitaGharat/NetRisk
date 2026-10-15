/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#060a12",
          sidebar: "#090e1a",
          card: "#0f172a",
          elevated: "#141f36",
          hover: "#192742",
          input: "#0b1120",
          border: "rgba(148, 163, 184, 0.12)",
          cardBorder: "rgba(56, 189, 248, 0.15)",
          cyan: "#00f2fe",
          blue: "#0ea5e9",
          sky: "#38bdf8",
          blueDeep: "#0284c7",
          textPrimary: "#f8fafc",
          textSecondary: "#94a3b8",
          textMuted: "#64748b",
        },
        risk: {
          low: "#10b981",
          moderate: "#f59e0b",
          high: "#f97316",
          veryHigh: "#ef4444",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow: "0 0 24px rgba(14, 165, 233, 0.18)",
        glowCyan: "0 0 24px rgba(0, 242, 254, 0.25)",
      }
    },
  },
  plugins: [],
}
