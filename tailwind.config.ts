export default {
  content: ['./app/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'alborota-pink':   'rgb(var(--color-alborota-pink) / <alpha-value>)',
        'alborota-olive':  'rgb(var(--color-alborota-olive) / <alpha-value>)',
        'alborota-orange': 'rgb(var(--color-alborota-orange) / <alpha-value>)',
        'alborota-cream':  'rgb(var(--color-alborota-cream) / <alpha-value>)',
        'alborota-black':  'rgb(var(--color-alborota-black) / <alpha-value>)',
        'alborota-grass':  'rgb(var(--color-alborota-grass) / <alpha-value>)',
        'alborota-beige':  'rgb(var(--color-alborota-beige) / <alpha-value>)',
      },
      fontFamily: {
        stevie:    ['StevieSans', 'sans-serif'],
        'stevie-book': ['StevieSansBook', 'serif'],
        abc:   ['ABC Diatype Unlicensed Trial', 'serif'],
      },
    },
  },
};
