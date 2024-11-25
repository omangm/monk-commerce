/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#008060",
        "graphite-gray": "#202223",
        "elec-blue": "#006EFF",
        "light-silver": "#F6F6F8",
        "sh-gray": "#00000080"
      },
    },
  },
  plugins: [],
}

