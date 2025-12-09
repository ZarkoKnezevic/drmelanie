import type { Config } from 'tailwindcss';
import { colorPreset } from './colorPreset';

/**
 * Tailwind Color Preset Configuration
 * Converts colorPreset data into a proper Tailwind config preset
 */
const tailwindColorPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        border: colorPreset.border,
        input: colorPreset.input,
        ring: colorPreset.ring,
        background: colorPreset.background,
        button: {
          DEFAULT: 'var(--button)',
          primary: {
            DEFAULT: colorPreset.button.primary.DEFAULT,
            text: colorPreset.button.primary.foreground,
            border: colorPreset.button.primary.foreground,
            hover: colorPreset.button.primary.hover,
          },
          secondary: {
            DEFAULT: colorPreset.button.secondary.DEFAULT,
            text: colorPreset.button.secondary.foreground,
            border: colorPreset.button.secondary.foreground,
            hover: colorPreset.button.secondary.hover,
          },
          tertiary: {
            DEFAULT: colorPreset.button.tertiary.DEFAULT,
            text: colorPreset.button.tertiary.foreground,
            border: colorPreset.button.tertiary.foreground,
            hover: colorPreset.button.tertiary.hover,
          },
          quaternary: {
            DEFAULT: colorPreset.button.quaternary.DEFAULT,
            text: colorPreset.button.quaternary.foreground,
            border: colorPreset.button.quaternary.foreground,
            hover: colorPreset.button.quaternary.hover,
          },
        },
        darkGray: colorPreset.darkGray,
        foreground: 'var(--foreground)',
        primary: colorPreset.primary,
        secondary: colorPreset.secondary,
        tertiary: colorPreset.tertiary,
        quaternary: colorPreset.quaternary,
        popover: colorPreset.popover,
        card: colorPreset.card,
        muted: colorPreset.muted,
        accent: colorPreset.accent,
        destructive: colorPreset.destructive,
      },
      borderRadius: {
        lg: colorPreset.radius,
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
};

export default tailwindColorPreset;
