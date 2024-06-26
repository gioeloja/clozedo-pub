/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", 
  "../src/**/*.{js,jsx}",
  "./*.js", 
  "../src/index.css",
  "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  "../node_modules/react-tailwindcss-datepicker/dist/index.esm.js"
],
  mode: "jit",
  plugins: [
    require('@tailwindcss/forms'),
  ],
  
  theme: {
    extend: {
      colors: {
        primary: "#00040f",
        secondary: "#00f6ff",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      screens: {
        'sm': '640px',
        // => @media (min-width: 640px) { ... }
  
        'md': '768px',
        // => @media (min-width: 768px) { ... }
  
        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
  
        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
        '3xl': '1920px',
      }
    },
  },
  plugins: [],
};