import type { Config } from 'tailwindcss';
import { fontStylePreset } from './src/components/ui/presets/fontStylePreset';
import { colorPreset } from './src/components/ui/presets/colorPreset';

export default {
  darkMode: ['class'],
  presets: [fontStylePreset, colorPreset],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    {
      pattern: /bg-background-(primary|secondary|tertiary|quaternary)/,
    },
    {
      pattern: /text-(primary|secondary|tertiary|quaternary)-foreground/,
    },
  ],
  theme: {
    screens: {
      sm: '390px',
      md: '600px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1540px',
    },
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      maxWidth: {
        container: '104rem', //1664px
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

