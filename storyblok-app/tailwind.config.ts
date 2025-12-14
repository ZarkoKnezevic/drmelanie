import type { Config } from 'tailwindcss';
import tailwindColorPreset from './src/components/ui/presets/tailwindColorPreset';
import tailwindFontPreset from './src/components/ui/presets/tailwindFontPreset';

export default {
  darkMode: ['class'],
  presets: [tailwindColorPreset, tailwindFontPreset],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    {
      pattern: /bg-background-(primary|secondary|tertiary|quaternary|quinary|senary)/,
    },
    {
      pattern: /text-(primary|secondary|tertiary|quaternary|quinary|senary)-foreground/,
    },
  ],
  theme: {
    screens: {
      sm: '390px',
      md: '600px',
      lg: '1025px',
      xl: '1280px',
      xxl: '1720px',
    },
    container: {
      center: true,
      padding: '1.5rem',
      screens: {}, // Disable responsive max-widths based on breakpoints
    },
    extend: {
      maxWidth: {
        container: '104rem', // 1664px - single max-width for all breakpoints
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
