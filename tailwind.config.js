/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  // NativeWind v2 doesn't require a preset
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF",
        secondary: "#A78BFA",
        accent: "#F97316",
        background: "#1A0B2E",
        surface: "#2D1B3D",
        muted: "#9CA3AF",
        gradient: {
          purple: "#8B5CF6",
          pink: "#EC4899",
          orange: "#F97316",
          yellow: "#FBBF24",
          green: "#10B981",
        },
      },
      backgroundImage: {
        "gradient-purple-pink": "linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)",
        "gradient-pink-orange": "linear-gradient(90deg, #EC4899 0%, #F97316 100%)",
        "gradient-orange-yellow": "linear-gradient(90deg, #F97316 0%, #FBBF24 100%)",
        "wavy-pattern": "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 10 Q 25 0, 50 10 T 100 10\" stroke=\"rgba(255,255,255,0.1)\" fill=\"none\" stroke-width=\"2\"/%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
};

