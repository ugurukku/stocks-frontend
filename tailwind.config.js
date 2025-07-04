/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function({ addBase }) {
      addBase({
        'button': {
          '&:hover': {
            cursor: 'pointer',
          },
        },
      })
    }
  ],
}
