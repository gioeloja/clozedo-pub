/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/index.html", 
  "./src/**/*.{js,jsx}",
    "./src/index.css",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  
  ],
  theme: {
    extend: {
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
  plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar')],
}
