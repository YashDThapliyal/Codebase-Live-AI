import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81"
        },
        ink: {
          50: "#f0f4fc",
          100: "#dde6f8",
          800: "#0f172a",
          900: "#080f20",
          950: "#040a14"
        }
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(79, 70, 229, 0.15)",
        card: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px -4px rgba(0,0,0,0.07)",
        "card-hover": "0 2px 6px rgba(0,0,0,0.05), 0 8px 24px -4px rgba(79,70,229,0.10)",
        "glow-indigo": "0 0 48px -8px rgba(99, 102, 241, 0.55)",
        "glow-cyan": "0 0 48px -8px rgba(6, 182, 212, 0.5)",
        "glow-emerald": "0 0 48px -8px rgba(16, 185, 129, 0.5)",
        "glow-amber": "0 0 48px -8px rgba(245, 158, 11, 0.5)",
        "glow-violet": "0 0 48px -8px rgba(168, 85, 247, 0.5)"
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.4s ease-out forwards",
        "orb-idle": "orbIdle 3s ease-in-out infinite",
        "orb-listen": "orbListen 1.2s ease-in-out infinite",
        "orb-speak": "orbSpeak 0.75s ease-in-out infinite",
        "ring-expand": "ringExpand 2.4s ease-out infinite",
        "ring-expand-delay": "ringExpand 2.4s ease-out 0.8s infinite",
        "score-fill": "scoreFill 0.9s cubic-bezier(0.22,1,0.36,1) forwards"
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" }
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(14px)" },
          to: { opacity: "1", transform: "translateX(0)" }
        },
        orbIdle: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(1.04)", opacity: "1" }
        },
        orbListen: {
          "0%, 100%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.07)" },
          "65%": { transform: "scale(0.96)" }
        },
        orbSpeak: {
          "0%, 100%": { transform: "scale(1)" },
          "18%": { transform: "scale(1.09)" },
          "48%": { transform: "scale(0.94)" },
          "78%": { transform: "scale(1.06)" }
        },
        ringExpand: {
          "0%": { transform: "scale(1)", opacity: "0.45" },
          "100%": { transform: "scale(2.3)", opacity: "0" }
        },
        scoreFill: {
          from: { width: "0%" },
          to: { width: "var(--score-width)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
