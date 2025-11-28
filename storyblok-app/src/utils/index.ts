/**
 * Utility functions barrel export
 */

export { env } from './env';
export { logger } from './logger';
export { cn } from './cn';

/**
 * Get background class based on background option
 */
export function getBackgroundClass(background?: string): string {
  if (!background) return '';
  
  const bgMap: Record<string, string> = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    tertiary: 'bg-tertiary',
  };
  
  return bgMap[background.toLowerCase()] || '';
}

/**
 * Get text color class based on background option (foreground color)
 */
export function getTextColorClass(background?: string): string {
  if (!background) return '';
  
  const textMap: Record<string, string> = {
    primary: 'text-primary-foreground',
    secondary: 'text-secondary-foreground',
    tertiary: 'text-tertiary-foreground',
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

