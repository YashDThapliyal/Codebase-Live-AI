import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eaf0ff",
          100: "#d6e2ff",
          500: "#1d4ed8",
          600: "#1e40af",
          700: "#1e3a8a"
        }
      },
      boxShadow: {
        soft: "0 12px 30px -18px rgba(15, 23, 42, 0.6)"
      }
    }
  },
  plugins: []
};

export default config;
