/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#fdfbf7',
          100: '#f7f3ec',
          200: '#efe9df',
          300: '#e5ded1'
        },
        ink: {
          DEFAULT: '#1c1a17',
          900: '#1c1a17',
          800: '#2b2723'
        },
        // Oxblood: primary accent for the editorial/boutique direction
        brand: {
          300: '#c4736f',
          400: '#a94a4a',
          500: '#963a3a',
          600: '#7d2a2a',
          700: '#651f1f'
        },
        // Brass: secondary accent, restrained
        gold: {
          50: '#f9f3e6',
          100: '#f0e5cf',
          200: '#e2d0ac',
          300: '#d3b784',
          400: '#bd9757',
          500: '#a67c2e',
          600: '#8a6522',
          700: '#6f5019'
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(28, 26, 23, 0.04), 0 10px 26px -20px rgba(28, 26, 23, 0.45)',
        'card-hover': '0 2px 4px rgba(28, 26, 23, 0.05), 0 18px 38px -24px rgba(28, 26, 23, 0.5)',
        'gold-glow': '0 0 0 1px rgba(166, 124, 46, 0.18)',
        'lux': '0 1px 2px rgba(28, 26, 23, 0.05), 0 10px 26px -20px rgba(28, 26, 23, 0.45)',
        'lux-hover': '0 2px 4px rgba(28, 26, 23, 0.06), 0 20px 40px -26px rgba(28, 26, 23, 0.55)',
        'brand-glow': '0 1px 2px rgba(125, 42, 42, 0.25)',
      }
    },
  },
  plugins: [],
}
