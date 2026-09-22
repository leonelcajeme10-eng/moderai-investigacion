/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { ink: '#12313b', brand: '#0f766e', mist: '#edf7f6' },
      boxShadow: { soft: '0 14px 35px rgba(15, 118, 110, .09)' }
    }
  },
  plugins: []
}
