/**
 * Lottie animation paths
 * Place downloaded Lottie JSON files in public/animations/
 */

export const LOTTIE_ANIMATIONS = {
  'stork': '/animations/stork.json',
  'baby': '/animations/baby.json',
} as const;

export type LottieAnimationName = keyof typeof LOTTIE_ANIMATIONS;

/**
 * Get the path to a Lottie animation by name
 */
export function getLottiePath(name: LottieAnimationName): string {
  return LOTTIE_ANIMATIONS[name];
}

