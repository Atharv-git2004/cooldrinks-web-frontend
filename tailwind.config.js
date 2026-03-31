/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0a0a0a",
          primary: "#00FFFF", // Electric Cyan
          secondary: "#003B46",
          accent: "#FFD700",
        },
      },
      fontFamily: {
        // Beverage brands-nu pattiya bold fonts
        'beverage': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}