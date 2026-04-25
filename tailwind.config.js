/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // DreamsPOS stilində olub fərqli (Premium Indigo) bir rəng seçilir:
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Primary: Indigo
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Yumşaq fonlar üçün
        background: '#FAFBFD',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['"Inter"', 'sys-ui', 'sans-serif'], // DreamsPOS-style təmiz şrift
      },
      boxShadow: {
        'soft': '0 4px 24px 0 rgba(34, 41, 47, 0.05)',
        'soft-lg': '0 8px 30px 0 rgba(34, 41, 47, 0.08)',
        'soft-xl': '0 12px 40px -4px rgba(0, 0, 0, 0.12)',
        'mega-xl': '0 25px 60px -12px rgba(0, 0, 0, 0.18)',
        'inner-soft': 'inset 0 2px 10px rgba(0,0,0,0.02)',
      },
      animation: {
        'shake': 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
