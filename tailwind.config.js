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
      boxShadow: {
        primary: '0px 4px 6px -1px rgba(0, 128, 96, 0.5), 0px 2px 4px -2px rgba(0, 128, 96, 0.25)',
      },
    },
  },
  plugins: [],
}

