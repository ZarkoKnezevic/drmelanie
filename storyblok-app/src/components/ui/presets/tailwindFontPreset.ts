import type { Config } from 'tailwindcss';
import { fontStylePreset } from './fontStylePreset';

/**
 * Tailwind Font Preset Configuration
 * Converts fontStylePreset data into a proper Tailwind config preset
 */
const tailwindFontPreset: Partial<Config> = {
  theme: {
    extend: {
      fontFamily: {
        karla: [fontStylePreset.fontFamily.karla, 'sans-serif'],
      },
      fontSize: fontStylePreset.fontSize,
      lineHeight: fontStylePreset.lineHeight,
      fontWeight: fontStylePreset.fontWeight,
    },
  },
};

export default tailwindFontPreset;

