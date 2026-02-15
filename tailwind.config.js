/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: "#ED0086",
          50: "#FFF0F7",
          100: "#FFD6EB",
          200: "#FF9ECF",
          300: "#FF5CB0",
          400: "#ED0086",
          500: "#CC0074",
        },
        lavender: {
          DEFAULT: "#D6DFF8",
          50: "#F5F7FF",
          100: "#EBF0FF",
          200: "#D6DFF8",
          300: "#B8C5F0",
          400: "#9AABE8",
          500: "#7C91E0",
        },
        orange: {
          DEFAULT: "#F25823",
          50: "#FFF3ED",
          100: "#FFE0D1",
          200: "#FFC0A3",
          300: "#FF9466",
          400: "#F25823",
          500: "#D4461A",
        },
        lime: {
          DEFAULT: "#BCDE3F",
          50: "#F8FCE8",
          100: "#EEF7C3",
          200: "#DDEF88",
          300: "#BCDE3F",
          400: "#A5C72E",
          500: "#8AAF1E",
        },
        ink: {
          DEFAULT: "#1A1A1A",
          50: "#F5F5F5",
          100: "#E5E5E5",
          200: "#CCCCCC",
          300: "#999999",
          400: "#666666",
          500: "#333333",
          600: "#1A1A1A",
          700: "#222222",
          800: "#2A2A2A",
          900: "#050505",
        },
        "border-dark": "#2D2D2D",
        "background-light": "#f8f5f7",
        "background-dark": "#1A1A1A",
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'slide-down': 'slideDown 0.25s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.06)',
        'glass-lg': '0 8px 40px rgba(0, 0, 0, 0.1)',
        'glow-primary': '0 0 20px rgba(237, 0, 134, 0.15)',
        'glow-lime': '0 0 20px rgba(188, 222, 63, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
