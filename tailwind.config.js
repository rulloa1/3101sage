/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        ink: {
          700: '#2b3038',
          800: '#1c2026',
          900: '#14171c',
          950: '#0d0f12',
        },
        bone: {
          50: '#faf9f6',
          100: '#f5f2ec',
          200: '#ebe6dc',
          300: '#dcd4c5',
        },
        brass: {
          200: '#e7d9be',
          300: '#d4bc94',
          400: '#c2a578',
          500: '#ab8a59',
          600: '#8d6f43',
          700: '#6d552f',
        },
        gold: {
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Instrument Serif', 'Iowan Old Style', 'Georgia', 'serif'],
      },
      spacing: {
        '4.5': '1.125rem',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(15, 23, 42, 0.06)',
        'soft': '0 1px 2px rgba(16, 20, 26, 0.04), 0 8px 24px -18px rgba(16, 20, 26, 0.28)',
        'card-hover': '0 2px 4px rgba(16, 20, 26, 0.04), 0 18px 36px -24px rgba(16, 20, 26, 0.34)',
        'panel': '0 1px 2px rgba(16, 20, 26, 0.05), 0 24px 48px -32px rgba(16, 20, 26, 0.30)',
        'gold-glow': '0 0 20px -3px rgba(194, 165, 120, 0.35)',
      },
      blur: {
        'xs': '2px',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        cardIn: {
          from: { opacity: '0', transform: 'translateY(10px) scale(0.99)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.18s ease-out both',
        slideUp: 'slideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) both',
        cardIn: 'cardIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        scaleIn: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}
