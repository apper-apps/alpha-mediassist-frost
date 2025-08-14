/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CCFF',
          300: '#66B2FF',
          400: '#3399FF',
          500: '#0066CC',
          600: '#0052A3',
          700: '#003D7A',
          800: '#002952',
          900: '#001429'
        },
        secondary: {
          50: '#E8F4FD',
          100: '#D1E9FB',
          200: '#A3D3F7',
          300: '#75BDF3',
          400: '#4A90E2',
          500: '#357ABD',
          600: '#2A6298',
          700: '#1F4973',
          800: '#14314E',
          900: '#0A1829'
        },
        accent: {
          50: '#E6F7ED',
          100: '#CCEFDB',
          200: '#99DFB7',
          300: '#66CF93',
          400: '#33BF6F',
          500: '#00A651',
          600: '#008541',
          700: '#006431',
          800: '#004221',
          900: '#002110'
        },
        surface: {
          50: '#FFFFFF',
          100: '#FAFBFC',
          200: '#F5F7FA',
          300: '#E5E7EB',
          400: '#D1D5DB',
          500: '#9CA3AF',
          600: '#6B7280',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      }
    },
  },
  plugins: [],
}