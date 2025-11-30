/**
 * Font Style Preset Configuration
 * References CSS variables defined in ui/css/fonts.css
 */

export const fontStylePreset = {
  // Font Family - CSS Variable
  fontFamily: {
    karla: 'var(--font-karla)',
  },

  // Font Sizes - CSS Variables
  fontSize: {
    base: {
      sm: 'var(--font-size-base-sm)',
      md: 'var(--font-size-base-md)',
      lg: 'var(--font-size-base-lg)',
    },
  },

  // Line Heights - CSS Variables
  lineHeight: {
    none: 'var(--line-height-none)',
    tight: 'var(--line-height-tight)',
    normal: 'var(--line-height-normal)',
  },

  // Font Weights - CSS Variables
  fontWeight: {
    normal: 'var(--font-weight-normal)',
    medium: 'var(--font-weight-medium)',
    semibold: 'var(--font-weight-semibold)',
    bold: 'var(--font-weight-bold)',
  },
} as const;

export type FontStylePreset = typeof fontStylePreset;

