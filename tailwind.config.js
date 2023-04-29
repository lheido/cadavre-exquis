/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      neutral: {
        DEFAULT: "#666167",
        content: "#f7f7f7",
      },
      primary: {
        DEFAULT: "#B58FC2",
        content: "#f7f7f7",
      },
      accent: {
        DEFAULT: "#7CC2A5",
        content: "#424242",
      },
      alert: {
        DEFAULT: "#D9598A",
        content: "#f7f7f7",
      },
      transparent: "transparent",
      currentColor: "currentColor",
    },
    extend: {
      fontFamily: {
        display: "Creepster",
      },
      screens: {
        xs: "390px",
      },
      animation: {
        "bounce-slow": "bounce 3s linear infinite",
      },
      supports: {
        ios: "-webkit-touch-callout: none",
      },
    },
  },
  plugins: [],
};
