/**
 * Utility functions barrel export
 */

export { env } from './env';
export { logger } from './logger';
export { cn } from './cn';

/**
 * Get background class based on background option
 * Supports both direct values and Storyblok data source slugs
 *
 * Tailwind class references (for JIT detection):
 * bg-background-primary bg-background-secondary bg-background-tertiary bg-background-quaternary bg-background-quinary
 */
export function getBackgroundClass(background?: string | { slug?: string }): string {
  if (!background) return '';

  // Handle Storyblok data source object (has slug property)
  let bgValue: string;
  if (typeof background === 'object' && background.slug) {
    bgValue = background.slug;
  } else if (typeof background === 'string') {
    bgValue = background;
  } else {
    return '';
  }

  const bgMap: Record<string, string> = {
    primary: 'bg-background-primary',
    secondary: 'bg-background-secondary',
    tertiary: 'bg-background-tertiary',
    quaternary: 'bg-background-quaternary',
    quinary: 'bg-background-quinary',
    senary: 'bg-background-senary',
    // New slug variations
    'rose-canvas': 'bg-background-primary',
    'petal-blush': 'bg-background-secondary',
    'hummingbird-teal': 'bg-background-tertiary',
    'baby-teal-mist': 'bg-background-quaternary',
    'stone-bloom': 'bg-background-quinary',
    'golden-petal': 'bg-background-senary',
    // Legacy support
    'hint-of-red': 'bg-background-primary',
    'rosewood-smoke': 'bg-background-primary',
    ebb: 'bg-background-secondary',
    cinderella: 'bg-background-tertiary',
    'mandys-pink': 'bg-background-quaternary',
    'mint-teal': 'bg-background-quinary',
  };

  // Normalize: remove spaces, convert to lowercase, handle dashes
  const normalized = bgValue.toLowerCase().trim().replace(/\s+/g, '-');

  return bgMap[normalized] || bgMap[bgValue.toLowerCase()] || '';
}

/**
 * Get text color class based on background option (foreground color)
 * Supports both direct values and Storyblok data source slugs
 */
export function getTextColorClass(background?: string | { slug?: string }): string {
  if (!background) return '';

  // Handle Storyblok data source object (has slug property)
  let bgValue: string;
  if (typeof background === 'object' && background.slug) {
    bgValue = background.slug;
  } else if (typeof background === 'string') {
    bgValue = background;
  } else {
    return '';
  }

  const textMap: Record<string, string> = {
    primary: 'text-primary-foreground',
    secondary: 'text-secondary-foreground',
    tertiary: 'text-tertiary-foreground',
    quaternary: 'text-quaternary-foreground',
    quinary: 'text-quinary-foreground',
    // Also support slug variations
    'hint-of-red': 'text-primary-foreground',
    ebb: 'text-secondary-foreground',
    cinderella: 'text-tertiary-foreground',
    'mandys-pink': 'text-quaternary-foreground',
    'mint-teal': 'text-quinary-foreground',
  };

  const normalized = bgValue.toLowerCase().trim().replace(/\s+/g, '-');

  return textMap[normalized] || textMap[bgValue.toLowerCase()] || '';
}

/**
 * Get heading text color class based on background option
 * Supports both direct values and Storyblok data source slugs
 */
export function getHeadingColorClass(background?: string | { slug?: string }): string {
  if (!background) return '';

  // Handle Storyblok data source object
  let bgValue: string;
  if (typeof background === 'object' && background.slug) {
    bgValue = background.slug;
  } else if (typeof background === 'string') {
    bgValue = background;
  } else {
    return '';
  }

  const normalized = bgValue.toLowerCase().trim().replace(/\s+/g, '-');
  const headingMap: Record<string, string> = {
    primary: 'text-[#c7017f]',
    secondary: 'text-[#c7017f]',
    tertiary: 'text-white',
    quaternary: 'text-[#c7017f]',
    quinary: 'text-[#c7017f]',
    senary: 'text-[#c7017f]',
    // Slug variations
    'rose-canvas': 'text-[#c7017f]',
    'petal-blush': 'text-[#c7017f]',
    'hummingbird-teal': 'text-white',
    'baby-teal-mist': 'text-[#c7017f]',
    'stone-bloom': 'text-[#c7017f]',
    'golden-petal': 'text-[#c7017f]',
    // Legacy support
    'hint-of-red': 'text-[#c7017f]',
    'rosewood-smoke': 'text-white',
    ebb: 'text-[#c7017f]',
    cinderella: 'text-[#c7017f]',
    'mandys-pink': 'text-[#c7017f]',
    'mint-teal': 'text-white',
  };

  return headingMap[normalized] || headingMap[bgValue.toLowerCase()] || '';
}

/**
 * Get body text color class based on background option
 * Supports both direct values and Storyblok data source slugs
 */
export function getBodyColorClass(background?: string | { slug?: string }): string {
  if (!background) return '';

  // Handle Storyblok data source object
  let bgValue: string;
  if (typeof background === 'object' && background.slug) {
    bgValue = background.slug;
  } else if (typeof background === 'string') {
    bgValue = background;
  } else {
    return '';
  }

  const normalized = bgValue.toLowerCase().trim().replace(/\s+/g, '-');
  const bodyMap: Record<string, string> = {
    primary: 'text-[#3a3a3a]',
    secondary: 'text-[#3a3a3a]',
    tertiary: 'text-white',
    quaternary: 'text-[#2f6f73]',
    quinary: 'text-[#3a3a3a]',
    senary: 'text-[#3a3a3a]',
    // Slug variations
    'rose-canvas': 'text-[#3a3a3a]',
    'petal-blush': 'text-[#3a3a3a]',
    'hummingbird-teal': 'text-white',
    'baby-teal-mist': 'text-[#2f6f73]',
    'stone-bloom': 'text-[#3a3a3a]',
    'golden-petal': 'text-[#3a3a3a]',
    // Legacy support
    'hint-of-red': 'text-[#3a3a3a]',
    'rosewood-smoke': 'text-white',
    ebb: 'text-[#3a3a3a]',
    cinderella: 'text-[#3a3a3a]',
    'mandys-pink': 'text-white',
    'mint-teal': 'text-[#2f6f73]',
  };

  return bodyMap[normalized] || bodyMap[bgValue.toLowerCase()] || '';
}

/**
 * Get subtle text color class based on background option
 * Supports both direct values and Storyblok data source slugs
 */
export function getSubtleColorClass(background?: string | { slug?: string }): string {
  if (!background) return '';

  // Handle Storyblok data source object
  let bgValue: string;
  if (typeof background === 'object' && background.slug) {
    bgValue = background.slug;
  } else if (typeof background === 'string') {
    bgValue = background;
  } else {
    return '';
  }

  const normalized = bgValue.toLowerCase().trim().replace(/\s+/g, '-');
  const subtleMap: Record<string, string> = {
    primary: 'text-[#6b6b6b]',
    secondary: 'text-[#7a7a7a]',
    tertiary: 'text-white/75',
    quaternary: 'text-[#5f8f91]',
    quinary: 'text-[#6f6f6f]',
    senary: 'text-[#6b5a3f]',
    // Slug variations
    'rose-canvas': 'text-[#6b6b6b]',
    'petal-blush': 'text-[#7a7a7a]',
    'hummingbird-teal': 'text-white/75',
    'baby-teal-mist': 'text-[#5f8f91]',
    'stone-bloom': 'text-[#6f6f6f]',
    'golden-petal': 'text-[#6b5a3f]',
    // Legacy support
    'hint-of-red': 'text-[#6b6b6b]',
    'rosewood-smoke': 'text-white/85',
    ebb: 'text-[#7a7a7a]',
    cinderella: 'text-[#a84a62]',
    'mandys-pink': 'text-white/80',
    'mint-teal': 'text-[#5f8f91]',
  };

  return subtleMap[normalized] || subtleMap[bgValue.toLowerCase()] || '';
}

/**
 * Get accent text color class based on background option
 * Supports both direct values and Storyblok data source slugs
 */
export function getAccentColorClass(background?: string | { slug?: string }): string {
  if (!background) return '';

  // Handle Storyblok data source object
  let bgValue: string;
  if (typeof background === 'object' && background.slug) {
    bgValue = background.slug;
  } else if (typeof background === 'string') {
    bgValue = background;
  } else {
    return '';
  }

  const normalized = bgValue.toLowerCase().trim().replace(/\s+/g, '-');
  const accentMap: Record<string, string> = {
    primary: 'text-[#c7017f]',
    secondary: 'text-[#c7017f]',
    tertiary: 'text-[#c7017f]',
    quaternary: 'text-[#c7017f]',
    quinary: 'text-[#c7017f]',
    senary: 'text-[#2f6f73]',
    // Slug variations
    'rose-canvas': 'text-[#c7017f]',
    'petal-blush': 'text-[#c7017f]',
    'hummingbird-teal': 'text-[#c7017f]',
    'baby-teal-mist': 'text-[#c7017f]',
    'stone-bloom': 'text-[#c7017f]',
    'golden-petal': 'text-[#2f6f73]',
    // Legacy support
    'hint-of-red': 'text-[#c7017f]',
    'rosewood-smoke': 'text-[#c7017f]',
    ebb: 'text-[#c7017f]',
    cinderella: 'text-[#c7017f]',
    'mandys-pink': 'text-[#c7017f]',
    'mint-teal': 'text-[#2f6f73]',
  };

  return accentMap[normalized] || accentMap[bgValue.toLowerCase()] || '';
}

/**
 * Get both background and text color classes based on background option
 * Supports both direct values and Storyblok data source slugs
 */
export function getBackgroundAndTextClasses(background?: string | { slug?: string }): string {
  if (!background) return '';

  const bgClass = getBackgroundClass(background);
  const textClass = getTextColorClass(background);

  return `${bgClass} ${textClass}`.trim();
}
