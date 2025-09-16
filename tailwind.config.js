// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'serif': ['Cinzel', 'serif'],
      },
      colors: {
        'brand-dark': '#380000',
        'brand-card': '#2a0000',
        'brand-gold': '#fde047',
      },
      backgroundImage: {
        'ceiling-pattern': "url('/src/assets/textures/ceiling-texture.jpg')",
      }
    },
  },
  plugins: [],
}
// Build Date: 2025-09-16 10:15 AM