/** @type {import('tailwindcss').Config} */
export default {
  // Make sure this content path matches your project structure
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary':'#163355',
        'secondary': '#197ADC', // Add your color here!
      },
      fontFamily: {
        arimo: ['Arimo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}