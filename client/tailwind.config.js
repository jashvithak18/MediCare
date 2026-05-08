/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'med-blue': '#0056b3',
        'med-light-blue': '#e6f0ff',
        'med-green': '#28a745',
        'med-white': '#ffffff',
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
