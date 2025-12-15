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
    septenary: 'bg-background-septenary',
    octonary: 'bg-background-octonary',
    nonary: 'bg-background-nonary',
    decenary: 'bg-background-decenary',
    // Slug variations - new system
    'magenta-bloom': 'bg-background-primary',
    'rose-canvas': 'bg-background-secondary',
    'petal-blush': 'bg-background-tertiary',
    'deep-berry': 'bg-background-quaternary',
    'vivid-fuchsia': 'bg-background-quinary',
    'soft-rose': 'bg-background-senary',
    'baby-rose': 'bg-background-septenary',
    'rose-mist': 'bg-background-octonary',
    'hummingbird-teal': 'bg-background-nonary',
    'baby-teal': 'bg-background-decenary',
    'golden-petal': 'bg-background-decenary', // Legacy support
    // Legacy support
    'hint-of-red': 'bg-background-secondary',
    'rosewood-smoke': 'bg-background-primary',
    ebb: 'bg-background-tertiary',
    cinderella: 'bg-background-nonary',
    'mandys-pink': 'bg-background-quaternary',
    'mint-teal': 'bg-background-quaternary',
    'baby-teal-mist': 'bg-background-quaternary',
    'stone-bloom': 'bg-background-quinary',
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
    secondary: 'text-[#c7017f]',
    tertiary: 'text-[#c7017f]',
    quaternary: 'text-white',
    quinary: 'text-white',
    senary: 'text-white',
    septenary: 'text-[#c7017f]',
    octonary: 'text-[#c7017f]',
    nonary: 'text-[#c7017f]',
    decenary: 'text-[#c7017f]',
    // Slug variations - new system
    'magenta-bloom': 'text-white',
    'rose-canvas': 'text-[#c7017f]',
    'petal-blush': 'text-[#c7017f]',
    'deep-berry': 'text-white',
    'vivid-fuchsia': 'text-white',
    'soft-rose': 'text-white',
    'baby-rose': 'text-[#c7017f]',
    'rose-mist': 'text-[#c7017f]',
    'hummingbird-teal': 'text-[#c7017f]',
    'baby-teal': 'text-[#c7017f]',
    'golden-petal': 'text-[#c7017f]', // Legacy support
    // Legacy support
    'hint-of-red': 'text-[#c7017f]',
    'rosewood-smoke': 'text-white',
    ebb: 'text-[#c7017f]',
    cinderella: 'text-[#c7017f]',
    'mandys-pink': 'text-white',
    'mint-teal': 'text-[#c7017f]',
    'baby-teal-mist': 'text-[#c7017f]',
    'stone-bloom': 'text-[#c7017f]',
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
    primary: 'text-white/90',
    secondary: 'text-[#3a3a3a]',
    tertiary: 'text-[#3a3a3a]',
    quaternary: 'text-white/90',
    quinary: 'text-white/90',
    senary: 'text-white/90',
    septenary: 'text-[#3a3a3a]',
    octonary: 'text-[#3a3a3a]',
    nonary: 'text-white',
    decenary: 'text-[#3a3a3a]',
    // Slug variations - new system
    'magenta-bloom': 'text-white/90',
    'rose-canvas': 'text-[#3a3a3a]',
    'petal-blush': 'text-[#3a3a3a]',
    'deep-berry': 'text-white/90',
    'vivid-fuchsia': 'text-white/90',
    'soft-rose': 'text-white/90',
    'baby-rose': 'text-[#3a3a3a]',
    'rose-mist': 'text-[#3a3a3a]',
    'hummingbird-teal': 'text-white',
    'baby-teal': 'text-[#2f6f73]',
    'golden-petal': 'text-[#2f6f73]', // Legacy support
    // Legacy support
    'hint-of-red': 'text-[#3a3a3a]',
    'rosewood-smoke': 'text-white',
    ebb: 'text-[#3a3a3a]',
    cinderella: 'text-white',
    'mandys-pink': 'text-white',
    'mint-teal': 'text-[#2f6f73]',
    'baby-teal-mist': 'text-[#2f6f73]',
    'stone-bloom': 'text-[#3a3a3a]',
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
    primary: 'text-white/70',
    secondary: 'text-[#6b6b6b]',
    tertiary: 'text-[#7a7a7a]',
    quaternary: 'text-white/70',
    quinary: 'text-white/75',
    senary: 'text-white/75',
    septenary: 'text-[#6b6b6b]',
    octonary: 'text-[#7a7a7a]',
    nonary: 'text-white/75',
    decenary: 'text-[#6b5a3f]',
    // Slug variations - new system
    'magenta-bloom': 'text-white/70',
    'rose-canvas': 'text-[#6b6b6b]',
    'petal-blush': 'text-[#7a7a7a]',
    'deep-berry': 'text-white/70',
    'vivid-fuchsia': 'text-white/75',
    'soft-rose': 'text-white/75',
    'baby-rose': 'text-[#6b6b6b]',
    'rose-mist': 'text-[#7a7a7a]',
    'hummingbird-teal': 'text-white/75',
    'baby-teal': 'text-[#5f8f91]',
    'golden-petal': 'text-[#5f8f91]', // Legacy support
    // Legacy support
    'hint-of-red': 'text-[#6b6b6b]',
    'rosewood-smoke': 'text-white/85',
    ebb: 'text-[#7a7a7a]',
    cinderella: 'text-white/75',
    'mandys-pink': 'text-white/80',
    'mint-teal': 'text-[#5f8f91]',
    'baby-teal-mist': 'text-[#5f8f91]',
    'stone-bloom': 'text-[#6f6f6f]',
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
    primary: 'text-white',
    secondary: 'text-[#c7017f]',
    tertiary: 'text-[#c7017f]',
    quaternary: 'text-white',
    quinary: 'text-white',
    senary: 'text-white',
    septenary: 'text-[#c7017f]',
    octonary: 'text-[#c7017f]',
    nonary: 'text-[#c7017f]',
    decenary: 'text-[#2f6f73]',
    // Slug variations - new system
    'magenta-bloom': 'text-white',
    'rose-canvas': 'text-[#c7017f]',
    'petal-blush': 'text-[#c7017f]',
    'deep-berry': 'text-white',
    'vivid-fuchsia': 'text-white',
    'soft-rose': 'text-white',
    'baby-rose': 'text-[#c7017f]',
    'rose-mist': 'text-[#c7017f]',
    'hummingbird-teal': 'text-[#c7017f]',
    'baby-teal': 'text-[#c7017f]',
    'golden-petal': 'text-[#c7017f]', // Legacy support
    // Legacy support
    'hint-of-red': 'text-[#c7017f]',
    'rosewood-smoke': 'text-[#c7017f]',
    ebb: 'text-[#c7017f]',
    cinderella: 'text-[#c7017f]',
    'mandys-pink': 'text-[#c7017f]',
    'mint-teal': 'text-[#2f6f73]',
    'baby-teal-mist': 'text-[#c7017f]',
    'stone-bloom': 'text-[#c7017f]',
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
