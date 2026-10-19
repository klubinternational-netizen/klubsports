import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#ee7700",
          "orange-dark": "#d46500",
          "orange-light": "#fff7ed",
          "orange-subtle": "#ffedd5",
          slate: "#625e5d",
          "slate-dark": "#3d3938",
          "slate-light": "#f5f4f3",
          charcoal: "#1c1917",
          surface: "#faf9f8",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["var(--font-jakarta)", "var(--font-inter)", "-apple-system", "sans-serif"],
        heading: ["var(--font-jakarta)", "var(--font-inter)", "-apple-system", "sans-serif"],
        inter: ["var(--font-inter)", "var(--font-jakarta)", "-apple-system", "sans-serif"],
        ranchers: ["'Ranchers'", "cursive", "sans-serif"],
      },
      boxShadow: {
        premium: "0 10px 30px -10px rgba(28, 25, 23, 0.08)",
        "premium-hover": "0 20px 40px -15px rgba(238, 119, 0, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
