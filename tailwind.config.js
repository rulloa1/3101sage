/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05080f',
          900: '#070b14',
          800: '#0b1120',
          700: '#111a2e',
          600: '#182338',
        },
        brand: {
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        gold: {
          400: '#facc15',
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
        'lux': '0 22px 50px -30px rgba(0, 0, 0, 0.95), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'lux-hover': '0 28px 60px -26px rgba(0, 0, 0, 1), inset 0 1px 0 0 rgba(255, 255, 255, 0.09)',
        'brand-glow': '0 0 24px -6px rgba(225, 29, 72, 0.55)',
      }
    },
  },
  plugins: [],
}
