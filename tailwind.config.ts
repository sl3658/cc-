import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        beige: "#F5EFE6",
        powder: "#C7D9F1",
        slateDeep: "#2E2E2E",
        powderHover: "#AFC5E5"
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"]
      },
      boxShadow: {
        soft: "0 8px 24px rgba(46, 46, 46, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
