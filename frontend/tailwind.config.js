/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Master Brand Colors
        cerulean: {
          DEFAULT: '#124874',      // Xanh Cerulean (RGB: 18, 72, 116)
          dark: '#0D3656',
          light: '#1B5D94',
        },
        jasper: {
          DEFAULT: '#CF373D',        // Đỏ Jasper (RGB: 207, 55, 61)
          dark: '#AB282D',
          light: '#DB5055',
        },
        brand: {
          blue: '#124874',
          cerulean: '#124874',
          red: '#CF373D',
          jasper: '#CF373D',
          ink: '#124874',
          dark: '#161413',
          paper: '#F7F4EE',
          paperLight: '#FCFAF6',
          paperDark: '#EDE7DC',
          brass: '#B8860B',
          gold: '#C59B27',
          forest: '#1E4A38',
          border: '#124874',
          borderLight: '#D8D1C5',
          muted: '#6E675F'
        }
      },
      fontFamily: {
        display: ['"Bodoni Moda"', '"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Newsreader"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        mono: ['"Courier Prime"', 'monospace']
      },
      boxShadow: {
        'stamp': 'inset 0 0 0 2px currentColor, 0 1px 2px rgba(0,0,0,0.05)',
        'docket': '0 4px 20px -2px rgba(18, 72, 116, 0.08), 0 1px 3px rgba(18, 72, 116, 0.05)',
        'press': '2px 3px 0px rgba(18, 72, 116, 0.95)',
        'press-red': '2px 3px 0px rgba(207, 55, 61, 0.95)'
      }
    },
  },
  plugins: [],
}
