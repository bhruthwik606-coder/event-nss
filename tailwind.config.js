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
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        nss: {
          navy: '#0f294a',
          blue: '#1a56db',
          purple: '#6d28d9',
          orange: '#ea580c',
          crimson: '#dc2626',
          gold: '#d97706',
          lightBg: '#f8fafc',
          cardBg: '#ffffff',
          surface: '#f1f5f9'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(15, 41, 74, 0.08)',
        'card-hover': '0 12px 30px -4px rgba(15, 41, 74, 0.14)',
        'elevated': '0 20px 40px -15px rgba(26, 86, 219, 0.18)',
      }
    },
  },
  plugins: [],
}
