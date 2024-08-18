import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import BLOG from './blog.config';
import CJK from './cjk';

const fontSansCJK = !CJK()
  ? []
  : [`"Noto Sans CJK ${CJK()}"`, `"Noto Sans ${CJK()}"`];
const fontSerifCJK = !CJK()
  ? []
  : [`"Noto Serif CJK ${CJK()}"`, `"Noto Serif ${CJK()}"`];

export default {
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        day: {
          DEFAULT: BLOG.lightBackground || '#ffffff',
        },
        night: {
          DEFAULT: BLOG.darkBackground || '#111827',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', ...fontFamily.sans, ...fontSansCJK],
        serif: ['"Source Serif"', ...fontFamily.serif, ...fontSerifCJK],
        noEmoji: [
          '"IBM Plex Sans"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
