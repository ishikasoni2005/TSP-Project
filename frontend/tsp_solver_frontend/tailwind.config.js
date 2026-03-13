/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        ember: {
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
        },
      },
      boxShadow: {
        soft: "0 24px 60px -28px rgba(15, 23, 42, 0.35)",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Manrope", "sans-serif"],
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at top left, rgba(34, 211, 238, 0.22), transparent 28%), radial-gradient(circle at top right, rgba(249, 115, 22, 0.18), transparent 30%), linear-gradient(135deg, rgba(255,255,255,0.92), rgba(240,249,255,0.9))",
        "mesh-dark": "radial-gradient(circle at top left, rgba(34, 211, 238, 0.16), transparent 28%), radial-gradient(circle at top right, rgba(249, 115, 22, 0.14), transparent 30%), linear-gradient(135deg, rgba(2,6,23,0.96), rgba(15,23,42,0.98))",
      },
    },
  },
  plugins: [],
};
