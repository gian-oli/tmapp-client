/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        pendulum: {
          '0%': {
            transform: 'rotate(50deg)',
          },
          '100%': {
            transform: 'rotate(-50deg)',
          },
        },
      },
      animation: {
        pendulum: 'pendulum 1s infinite alternate ease-in-out',
      },
      colors: {
        primary: '#000', // Adjust to your desired color
      },
      spacing: {
        'pendulum-size': '30px',
      },
      transformOrigin: {
        'custom': '50% -200%',
      },
    },
  },
  plugins: [],
}
