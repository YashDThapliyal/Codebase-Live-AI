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
          50: "#eef5ff",
          100: "#dbe8ff",
          500: "#2f6fed",
          600: "#2459c9",
          700: "#1f469d"
        }
      },
      boxShadow: {
        soft: "0 10px 30px -18px rgba(26, 47, 85, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
