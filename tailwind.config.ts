import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#168447",
          dark: "#105C35",
          accent: "#35B86B",
        },
        warm: {
          cream: "#FFF7EA",
          sun: "#F5A524",
          clay: "#E0703A",
        },
        surface: "#F5F8F5",
        ink: {
          DEFAULT: "#17231C",
          muted: "#68756C",
        },
        line: "#E1E8E2",
        danger: "#DC3545",
        warning: "#E6A23C",
        success: "#168447",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(23, 35, 28, 0.06), 0 4px 12px rgba(23, 35, 28, 0.04)",
      },
    },
  },
  plugins: [],
} satisfies Config;
