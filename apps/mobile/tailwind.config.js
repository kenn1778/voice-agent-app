/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './global.css'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: { DEFAULT: '#4F46E5', light: '#6366F1', dark: '#4338CA' },
        secondary: { DEFAULT: '#0EA5E9', light: '#38BDF8', dark: '#0284C7' },
        accent: { DEFAULT: '#06B6D4', light: '#22D3EE', dark: '#0891B2' },
        surface: { DEFAULT: '#FFFFFF', dark: '#0F0F23' },
        background: { DEFAULT: '#F5F5FA', dark: '#07071A' },
        text: { DEFAULT: '#1E1B4B', dark: '#E0E7FF' },
        textSecondary: { DEFAULT: '#6366F1', dark: '#A5B4FC' },
        error: { DEFAULT: '#EF4444', light: '#FEE2E2' },
        success: { DEFAULT: '#10B981', light: '#D1FAE5' },
        warning: { DEFAULT: '#F59E0B', light: '#FEF3C7' },
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
