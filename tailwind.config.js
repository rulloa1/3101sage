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
        gold: {
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 12px 28px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)',
        'gold-glow': '0 0 20px -3px rgba(234, 179, 8, 0.25)',
      }
    },
  },
  plugins: [],
}
