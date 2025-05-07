/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        alexandria: ['Alexandria', 'sans-serif'],
        sans: ['Alexandria', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Apple-like color scheme
        primary: {
          DEFAULT: '#007AFF', // iOS blue
          dark: '#0062CC',
          light: '#4CA5FF',
        },
        secondary: {
          DEFAULT: '#34C759', // iOS green
          dark: '#28A745',
          light: '#5FD679',
        },
        neutral: {
          50: '#F9F9F9',
          100: '#F2F2F7',
          200: '#E5E5EA',
          300: '#D1D1D6',
          400: '#C7C7CC',
          500: '#AEAEB2',
          600: '#8E8E93',
          700: '#636366',
          800: '#48484A',
          900: '#3A3A3C',
          950: '#1C1C1E',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 