/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    
    extend: {
      keyframes: {
        filter: {
          '0%': { transform:" translateX(-400px)"},
          '50%': {transform:" translateX(-200px)" },
          '100%': {transform:" translateX(0px)" },
        }
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/line-clamp'),
    require('tailwindcss-textshadow'),
    require("@tailwindcss/aspect-ratio"),
  ],
}
