/**
 * Utility functions barrel export
 */

export { env } from './env';
export { logger } from './logger';
export { cn } from './cn';

/**
 * Get background class based on background option
 * 
 * Tailwind class references (for JIT detection):
 * bg-background-primary bg-background-secondary bg-background-tertiary bg-background-quaternary
 */
export function getBackgroundClass(background?: string): string {
  if (!background) return '';

  const bgMap: Record<string, string> = {
    primary: 'bg-background-primary',
    secondary: 'bg-background-secondary',
    tertiary: 'bg-background-tertiary',
    quaternary: 'bg-background-quaternary',
  };

  return bgMap[background.toLowerCase()] || '';
}

/**
 * Get text color class based on background option (foreground color)
 * 
 * Tailwind class references (for JIT detection):
 * text-primary-foreground text-secondary-foreground text-tertiary-foreground text-quaternary-foreground
 */
export function getTextColorClass(background?: string): string {
  if (!background) return '';

  const textMap: Record<string, string> = {
    primary: 'text-primary-foreground',
    secondary: 'text-secondary-foreground',
    tertiary: 'text-tertiary-foreground',
    quaternary: 'text-quaternary-foreground',
  };

  return textMap[background.toLowerCase()] || '';
}

/**
 * Get both background and text color classes based on background option
 */
export function getBackgroundAndTextClasses(background?: string): string {
  if (!background) return '';

  const bgClass = getBackgroundClass(background);
  const textClass = getTextColorClass(background);

  return `${bgClass} ${textClass}`.trim();
}

