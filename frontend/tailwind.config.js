/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        linen: {
          50: "#F7F3EC",
          100: "#EFE8DC",
          200: "#E2D8C8",
          300: "#D0C4B0",
          400: "#B8AA94",
        },
        ink: {
          900: "#1A1814",
          800: "#2C2822",
          700: "#3F3A33",
          600: "#5C564C",
          500: "#7A7368",
          400: "#9A9286",
        },
        sage: {
          700: "#3D4A36",
          600: "#4F5F47",
          500: "#5A6B4E",
          400: "#6F8260",
          300: "#8A9A7A",
          200: "#B4C0A8",
          100: "#D5DDCE",
        },
        studio: {
          paper: "#E8E0D4",
          wash: "#F3EEE6",
          dusk: "#2A2620",
          duskSoft: "#35302A",
        },
      },
      fontFamily: {
        heading: ['"Fraunces Variable"', "Fraunces", "Georgia", "serif"],
        body: ['"DM Sans Variable"', "DM Sans", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 40px -24px rgba(26, 24, 20, 0.28)",
        lift: "0 8px 24px -16px rgba(26, 24, 20, 0.22)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "grain-drift": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(-1%, 1%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        shimmer: "shimmer 1.5s linear infinite",
        "grain-drift": "grain-drift 18s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
