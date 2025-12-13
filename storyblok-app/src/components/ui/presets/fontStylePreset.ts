/**
 * Font Style Preset Configuration
 * References CSS variables defined in ui/css/fonts.css
 */

export const fontStylePreset = {
  // Font Family - CSS Variable
  fontFamily: {
    montserrat: 'var(--font-montserrat)',
  },

  // Font Sizes - CSS Variables (using Tailwind tuple format)
  fontSize: {
    'body-sm': [
      'var(--font-size-base-sm)',
      {
        lineHeight: 'var(--line-height-base-sm)',
        fontWeight: 'var(--font-weight-body)',
      },
    ],
    'body-md': [
      'var(--font-size-base-md)',
      {
        lineHeight: 'var(--line-height-base-md)',
      },
    ],
    'body-lg': [
      'var(--font-size-base-lg)',
      {
        lineHeight: 'var(--line-height-base-lg)',
      },
    ],
    h1: [
      'var(--font-size-h1-sm)',
      {
        lineHeight: 'var(--line-height-h1-sm)',
        fontWeight: 'var(--font-weight-heading)',
      },
    ],
    'h1-md': [
      'var(--font-size-h1-md)',
      {
        lineHeight: 'var(--line-height-h1-md)',
      },
    ],
    'h1-lg': [
      'var(--font-size-h1-lg)',
      {
        lineHeight: 'var(--line-height-h1-lg)',
      },
    ],
    h2: [
      'var(--font-size-h2-sm)',
      {
        lineHeight: 'var(--line-height-h2-sm)',
        fontWeight: 'var(--font-weight-heading)',
      },
    ],
    'h2-md': [
      'var(--font-size-h2-md)',
      {
        lineHeight: 'var(--line-height-h2-md)',
      },
    ],
    'h2-lg': [
      'var(--font-size-h2-lg)',
      {
        lineHeight: 'var(--line-height-h2-lg)',
      },
    ],
    h3: [
      'var(--font-size-h3-sm)',
      {
        lineHeight: 'var(--line-height-h3-sm)',
        fontWeight: 'var(--font-weight-heading)',
      },
    ],
    'h3-md': [
      'var(--font-size-h3-md)',
      {
        lineHeight: 'var(--line-height-h3-md)',
      },
    ],
    'h3-lg': [
      'var(--font-size-h3-lg)',
      {
        lineHeight: 'var(--line-height-h3-lg)',
      },
    ],
    h4: [
      'var(--font-size-h4-sm)',
      {
        fontWeight: 'var(--font-weight-heading)',
        lineHeight: 'var(--line-height-h4-sm)',
      },
    ],
    'h4-md': [
      'var(--font-size-h4-md)',
      {
        lineHeight: 'var(--line-height-h4-md)',
      },
    ],
    'h4-lg': [
      'var(--font-size-h4-lg)',
      {
        lineHeight: 'var(--line-height-h4-lg)',
      },
    ],
    h5: [
      'var(--font-size-h5-sm)',
      {
        fontWeight: 'var(--font-weight-heading)',
        lineHeight: 'var(--line-height-h5-sm)',
      },
    ],
    'h5-md': [
      'var(--font-size-h5-md)',
      {
        lineHeight: 'var(--line-height-h5-md)',
      },
    ],
    'h5-lg': [
      'var(--font-size-h5-lg)',
      {
        lineHeight: 'var(--line-height-h5-lg)',
      },
    ],
    h6: [
      'var(--font-size-h6-sm)',
      {
        lineHeight: 'var(--line-height-h6-sm)',
        fontWeight: 'var(--font-weight-heading)',
      },
    ],
    'h6-md': [
      'var(--font-size-h6-md)',
      {
        lineHeight: 'var(--line-height-h6-md)',
      },
    ],
    'h6-lg': [
      'var(--font-size-h6-lg)',
      {
        lineHeight: 'var(--line-height-h6-lg)',
      },
    ],
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
