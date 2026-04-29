/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ink': '#1a1917',
        'ink-2': '#6b6a67',
        'ink-3': '#9b9a97',
        'surface': '#f8f7f4',
        'surface-2': '#e0ddd6',
        'teal': '#0f7b6c',
        'teal-2': '#0a5a4e',
        'teal-bg': '#e6f5f3',
        'danger': '#c0392b',
        'danger-bg': '#fcebea',
        'warn': '#b5620a',
        'warn-bg': '#fef3e7',
      },
      fontFamily: {
        'epilogue': ['Epilogue', 'sans-serif'],
        'syne': ['Syne', 'sans-serif'],
      },
    },
  },
  plugins: [],
}