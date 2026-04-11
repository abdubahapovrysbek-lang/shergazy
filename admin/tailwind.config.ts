import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eeecff',
          100: '#d9d6ff',
          200: '#b8b2ff',
          300: '#9089ff',
          400: '#7b72ff',
          500: '#6c63ff',
          600: '#5a51e8',
          700: '#4640c4',
          800: '#35319f',
          900: '#272480',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
