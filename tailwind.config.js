/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [],
  theme: {
    extend: {
      colors: {
        primary: "#1A1A1A",
        secondary: "#7C9082",
        accent: "#E8927C",
        background: "#FAFAF8",
        surface: "#FFFFFF",
        muted: "#6B6B6B",
      },
    },
  },
  plugins: [],
};

