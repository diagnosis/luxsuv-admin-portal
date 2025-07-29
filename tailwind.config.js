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
          50: '#f8f9fb',
          100: '#f1f3f7',
          200: '#e5e9f0',
          300: '#d0d8e6',
          400: '#95a3bc',
          500: '#7877ba',
          600: '#6366b8',
          700: '#563553',
          800: '#4a2f4a',
          900: '#3d2740',
        },
        success: {
          50: '#f6f8f4',
          100: '#eef2e8',
          500: '#59684b',
          600: '#4f5e42',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
        },
        accent: {
          50: '#faf9fb',
          100: '#f4f3f7',
          200: '#e9e7f0',
          300: '#d5d1e3',
          400: '#95a3bc',
          500: '#7877ba',
          600: '#6366b8',
          700: '#563553',
          800: '#4a2f4a',
          900: '#3d2740',
        }
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      }
    },
  },
  plugins: [],
}