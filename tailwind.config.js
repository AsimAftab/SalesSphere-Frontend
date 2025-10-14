/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // --- ADD THIS 'screens' OBJECT ---
      colors: {
        'primary':'#163355',
        'secondary': '#197ADC',
      },
      fontFamily: {
        arimo: ['Arimo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}