import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        magnata: {
          black:  '#080806',
          surf:   '#111109',
          card:   '#181612',
          gold:   '#C9A030',
          'gold-light': '#E8C060',
          'gold-dim':   'rgba(201,160,48,0.10)',
          red:    '#7A1818',
          cream:  '#F0E8D0',
          muted:  '#A09070',
          dim:    '#7A6E5E',
          border: 'rgba(201,160,48,0.18)',
          'border-hover': 'rgba(201,160,48,0.45)',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['Montserrat', 'sans-serif'],
      },
      animation: {
        'fade-up':    'fadeUp 0.45s ease both',
        'slide-in':   'slideIn 0.35s cubic-bezier(0.22,1,0.36,1)',
        'scale-in':   'scaleIn 0.3s ease',
        'shimmer':    'shimmer 3.5s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn:   { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.94) translateY(16px)' }, to: { opacity: '1', transform: 'scale(1) translateY(0)' } },
        shimmer:   { '0%': { backgroundPosition: '100% 0' }, '100%': { backgroundPosition: '-100% 0' } },
        pulseSoft: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(100deg, #C9A030 0%, #E8C060 42%, #fff5e0 52%, #E8C060 62%, #C9A030 100%)',
      },
      backgroundSize: {
        '200': '200%',
      },
    },
  },
  plugins: [],
} satisfies Config
