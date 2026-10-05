/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#070707', 900: '#0d0d0d', 800: '#141414', 700: '#1c1c1c', 600: '#262626' },
        gold: { DEFAULT: '#b8975a', soft: '#d9c08e' },
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(18px)' }, '100%': { opacity: 1, transform: 'none' } },
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        pop: { '0%, 100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.4)' } },
        'slide-in': { '0%': { opacity: 0, transform: 'translateX(24px)' }, '100%': { opacity: 1, transform: 'none' } },
      },
      animation: {
        'fade-up': 'fade-up .9s ease both',
        'fade-in': 'fade-in .6s ease both',
        pop: 'pop .35s ease',
        'slide-in': 'slide-in .35s ease both',
      },
    },
  },
  plugins: [],
};
