import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tajawal', '-apple-system', 'BlinkMacSystemFont', 'Arial', 'sans-serif'],
      },
      colors: {
        // iOS color palette
        ios: {
          blue: 'var(--ios-blue)',
          green: 'var(--ios-green)',
          indigo: 'var(--ios-indigo)',
          orange: 'var(--ios-orange)',
          pink: 'var(--ios-pink)',
          purple: 'var(--ios-purple)',
          red: 'var(--ios-red)',
          teal: 'var(--ios-teal)',
          yellow: 'var(--ios-yellow)',
        },
        // Gray scale
        gray: {
          DEFAULT: 'var(--ios-gray)',
          50: 'var(--ios-gray6)',
          100: 'var(--ios-gray5)',
          200: 'var(--ios-gray4)',
          300: 'var(--ios-gray3)',
          400: 'var(--ios-gray2)',
          500: 'var(--ios-gray)',
        },
        // Theme colors
        theme: {
          background: 'var(--background-color)',
          secondary: 'var(--secondary-background)',
          text: 'var(--text-color)',
          'text-secondary': 'var(--text-secondary)',
          'text-tertiary': 'var(--text-tertiary)',
        },
      },
      // Border radius matching CSS variables
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      // Box shadow matching CSS variables
      boxShadow: {
        card: 'var(--card-shadow)',
      },
      // Animation transitions matching CSS variables
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionTimingFunction: {
        'ios': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '250ms',
        'slow': '500ms',
      },
      // Keyframes for animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
      },
      animation: {
        fadeIn: 'fadeIn var(--transition-slow) forwards',
      },
    },
  },
  plugins: [],
};

export default config; 