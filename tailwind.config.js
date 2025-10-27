/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2176FF', // Мятно-синий
        'primary-dark': '#1B5FCC',
        secondary: '#2C2C2C', // Глубокий тёплый серый
        'warm-gray': '#90A3B3', // Светло-синий
        'graphite': '#4B5563', // Графит
        'cream': '#FAFAF8', // Молочный светлый
        'accent': '#4FD1C5', // Светлая бирюза
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce': 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
};