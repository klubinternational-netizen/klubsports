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
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "var(--font-jakarta)", "sans-serif"],
        heading: ["var(--font-outfit)", "sans-serif"],
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
