/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2E2A47",
          dark: "#1E1A37",
          light: "#F1EFF8",
        },
        accent: {
          DEFAULT: "#EA580C",
          hover: "#C2410C",
          light: "#FFEDD5",
        },
      },
    },
  },
  plugins: [],
};
