/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      colors: {
        dao: {
          bg:      "#0a0a0f",
          surface: "#111118",
          border:  "#1e1e2e",
          accent:  "#7c3aed",
          accent2: "#06b6d4",
          muted:   "#3f3f5a",
          text:    "#e2e2f0",
          dim:     "#888899",
        },
      },
    },
  },
  plugins: [],
};
