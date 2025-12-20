import type { Config } from 'tailwindcss';
import { fontStylePreset } from './fontStylePreset';

/**
 * Tailwind Font Preset Configuration
 * Converts fontStylePreset data into a proper Tailwind config preset
 */
// Convert readonly fontSize tuples to mutable arrays for Tailwind
const fontSize: Record<string, [string, { lineHeight?: string; fontWeight?: string }]> = {};
Object.entries(fontStylePreset.fontSize).forEach(([key, value]) => {
  fontSize[key] = [value[0], { ...value[1] }];
});

const tailwindFontPreset: Partial<Config> = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-brother-1816-book)', 'sans-serif'],
        montserrat: ['var(--font-brother-1816-book)', 'sans-serif'], // Keep for backward compatibility
      },
      fontSize,
      lineHeight: fontStylePreset.lineHeight,
      fontWeight: fontStylePreset.fontWeight,
    },
  },
};

export default tailwindFontPreset;
