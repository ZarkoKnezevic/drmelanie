/**
 * Color Preset Configuration
 * References CSS variables defined in ui/css/colors.css
 */

export const colorPreset = {
  // Base Colors - CSS Variables
  white: 'var(--white)',
  mauve: 'var(--mauve)',
  magenta: 'var(--magenta)',
  lavander: 'var(--lavander)',
  gray: 'var(--gray)',
  teal: 'var(--teal)',
  warmBeige: 'var(--warm-beige)',
  lightGray: 'var(--light-gray)',
  darkGray: 'var(--dark-gray)',
  softSand: 'var(--soft-sand)',
  brandText: 'var(--brand-text)',
  brandBackground: 'var(--brand-background)',

  // Background Colors - CSS Variables
  background: {
    DEFAULT: 'var(--background)',
    primary: 'var(--background-primary)',
    secondary: 'var(--background-secondary)',
    tertiary: 'var(--background-tertiary)',
    quaternary: 'var(--background-quaternary)',
  },

  // Button Colors - CSS Variables
  button: {
    DEFAULT: 'var(--button-default)',
    primary: {
      DEFAULT: 'var(--button-primary)',
      foreground: 'var(--button-primary-foreground)',
      hover: 'var(--button-primary-hover)',
    },
    secondary: {
      DEFAULT: 'var(--button-secondary)',
      foreground: 'var(--button-secondary-foreground)',
      hover: 'var(--button-secondary-hover)',
    },
    tertiary: {
      DEFAULT: 'var(--button-tertiary)',
      foreground: 'var(--button-tertiary-foreground)',
      hover: 'var(--button-tertiary-hover)',
    },
    quaternary: {
      DEFAULT: 'var(--button-quaternary)',
      foreground: 'var(--button-quaternary-foreground)',
      hover: 'var(--button-quaternary-hover)',
    },
  },

  // Semantic Colors - CSS Variables
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

  // UI Colors - CSS Variables
  muted: {
    DEFAULT: 'var(--muted)',
    foreground: 'var(--muted-foreground)',
  },
  accent: {
    DEFAULT: 'var(--accent)',
    foreground: 'var(--accent-foreground)',
  },
  destructive: {
    DEFAULT: 'var(--destructive)',
    foreground: 'var(--destructive-foreground)',
  },
  border: 'var(--border)',
  input: 'var(--input)',
  ring: 'var(--ring)',
  card: {
    DEFAULT: 'var(--card)',
    foreground: 'var(--card-foreground)',
  },
  popover: {
    DEFAULT: 'var(--popover)',
    foreground: 'var(--popover-foreground)',
  },
  radius: 'var(--radius)',
} as const;

export type ColorPreset = typeof colorPreset;
