/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EEF6E8',   // Light Green
          100: '#D4EBBC',
          200: '#B5D98A',
          400: '#8BBF68',
          600: '#6A994E',   // Primary Green
          800: '#4A7035',   // Dark Green
          900: '#2E2E2E',   // Dark Gray
        },
        success: {
          50:  '#EEF6E8',
          500: '#6A994E',
          800: '#4A7035',
        },
        warning: {
          50:  '#FEF3E8',
          500: '#F4A261',   // Warning Orange
          800: '#C4743A',
        },
        danger: {
          50:  '#FDECEA',
          500: '#E76F51',   // Danger Red
          800: '#B84E36',
        },
        info: {
          50:  '#EBF3FF',
          500: '#3A86FF',   // Info Blue
          800: '#1A5FCC',
        },
        surface: {
          DEFAULT: '#F7F7F5', // Light Gray background
          dark:    '#2E2E2E', // Dark Gray text
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)',
        'card-hover': '0 4px 12px rgba(106,153,78,.12)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)' },
          to:   { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in':       'fadeIn .3s ease',
        'slide-in-left': 'slideInLeft .25s ease',
      },
    },
  },
  plugins: [],
}