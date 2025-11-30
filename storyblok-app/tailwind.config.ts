import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
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
      fontFamily: {
        karla: ['var(--font-karla)', 'sans-serif'],
      },
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: {
          DEFAULT: 'var(--background)',
          primary: 'var(--background-primary)',
          secondary: 'var(--background-secondary)',
          tertiary: 'var(--background-tertiary)',
          quaternary: 'var(--background-quaternary)',
        },
        button: {
          DEFAULT: 'var(--button)',
          primary: {
            DEFAULT: 'var(--button-primary)',
            text: 'var(--button-primary-foreground)',
            border: 'var(--button-primary-foreground)',
            hover: 'var(--button-primary-hover)',
          },
          secondary: {
            DEFAULT: 'var(--button-secondary)',
            text: 'var(--button-secondary-foreground)',
            border: 'var(--button-secondary-foreground)',
            hover: 'var(--button-secondary-hover)',
          },
          tertiary: {
            DEFAULT: 'var(--button-tertiary)',
            text: 'var(--button-tertiary-foreground)',
            border: 'var(--button-tertiary-foreground)',
            hover: 'var(--button-tertiary-hover)',
          },
          quaternary: {
            DEFAULT: 'var(--button-quaternary)',
            text: 'var(--button-quaternary-foreground)',
            border: 'var(--button-quaternary-foreground)',
            hover: 'var(--button-quaternary-hover)',
          },
        },
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        tertiary: {
          DEFAULT: 'var(--tertiary)',
          foreground: 'var(--tertiary-foreground)',
        },
        quaternary: {
          DEFAULT: 'var(--quaternary)',
          foreground: 'var(--quaternary-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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

