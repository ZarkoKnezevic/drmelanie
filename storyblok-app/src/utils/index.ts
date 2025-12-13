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
    // Also support slug variations
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
    primary: 'text-white',
    secondary: 'text-[#3a3a3a]',
    tertiary: 'text-[#3a3a3a]',
    quaternary: 'text-white',
    quinary: 'text-[#2f6f73]',
    'hint-of-red': 'text-white',
    'rosewood-smoke': 'text-white',
    ebb: 'text-[#3a3a3a]',
    cinderella: 'text-[#3a3a3a]',
    'mandys-pink': 'text-white',
    'mint-teal': 'text-[#2f6f73]',
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
    primary: 'text-white',
    secondary: 'text-[#3a3a3a]',
    tertiary: 'text-[#3a3a3a]',
    quaternary: 'text-white',
    quinary: 'text-[#2f6f73]',
    'hint-of-red': 'text-white',
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
    primary: 'text-white/85',
    secondary: 'text-[#4a4d4f]',
    tertiary: 'text-[#a84a62]',
    quaternary: 'text-white/80',
    quinary: 'text-[#4a4d4f]',
    'hint-of-red': 'text-white/85',
    'rosewood-smoke': 'text-white/85',
    ebb: 'text-[#4a4d4f]',
    cinderella: 'text-[#a84a62]',
    'mandys-pink': 'text-white/80',
    'mint-teal': 'text-[#4a4d4f]',
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
    primary: 'text-[#cdebea]',
    secondary: 'text-[#2f6f73]',
    tertiary: 'text-[#2f6f73]',
    quaternary: 'text-[#2f6f73]',
    quinary: 'text-[#2f6f73]',
    'hint-of-red': 'text-[#cdebea]',
    'rosewood-smoke': 'text-[#cdebea]',
    ebb: 'text-[#2f6f73]',
    cinderella: 'text-[#2f6f73]',
    'mandys-pink': 'text-[#2f6f73]',
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
