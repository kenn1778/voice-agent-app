/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './global.css'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2563EB', light: '#3B82F6', dark: '#1D4ED8' },
        secondary: { DEFAULT: '#7C3AED', light: '#8B5CF6', dark: '#6D28D9' },
        accent: { DEFAULT: '#06B6D4', light: '#22D3EE', dark: '#0891B2' },
        surface: { DEFAULT: '#FFFFFF', dark: '#111827' },
        background: { DEFAULT: '#F9FAFB', dark: '#030712' },
        text: { DEFAULT: '#111827', dark: '#F9FAFB' },
        error: { DEFAULT: '#DC2626', light: '#FCA5A5' },
        success: { DEFAULT: '#16A34A', light: '#86EFAC' },
        warning: { DEFAULT: '#D97706', light: '#FCD34D' },
      },
    },
  },
  plugins: [],
};
