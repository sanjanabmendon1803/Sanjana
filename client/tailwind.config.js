/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFAF4',
          100: '#FAF8F2',
          200: '#F4EFE6',
          300: '#E8E1D3',
          400: '#D6CCB8',
          500: '#BDB199',
        },
        forest: {
          50: '#F0F6F3',
          100: '#DCE9E2',
          200: '#B8D4C5',
          300: '#8EBBA4',
          400: '#5F9F7E',
          500: '#3D8161',
          600: '#245C45', // Primary Forest Green
          700: '#1B4735',
          800: '#143528',
          900: '#0E241B',
        },
        terracotta: {
          50: '#FAF2EE',
          100: '#F3E1D9',
          200: '#E7C2B2',
          300: '#DAA28C',
          400: '#CD8668',
          500: '#C77C58', // Muted Terracotta
          600: '#A95E3B',
          700: '#85472B',
          800: '#64341E',
          900: '#432213',
        },
        charcoal: {
          50: '#F6F6F6',
          100: '#E7E7E8',
          200: '#D0D1D2',
          300: '#A1A3A7',
          400: '#71757A',
          500: '#4A4D53',
          600: '#31343A',
          700: '#25272B',
          800: '#1C1E21',
          900: '#121315',
        },
        turmeric: {
          500: '#D99B26',
          600: '#B87F18',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Merriweather', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(36, 92, 69, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'lifted': '0 10px 30px -5px rgba(36, 92, 69, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      }
    },
  },
  plugins: [],
}
