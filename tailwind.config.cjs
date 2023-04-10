/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],

  theme: {
    extend: {
      gridTemplateRows: {
        // Простая 8-рядная сетка
        9: 'repeat(9, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
}
