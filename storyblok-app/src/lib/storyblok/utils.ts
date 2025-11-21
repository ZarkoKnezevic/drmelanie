import { STORYBLOK_CONFIG } from '@/constants';
import { env, logger } from '@/utils';

/**
 * Fetcher utility for Storyblok API calls
 */
export async function fetcher(
  url: string,
  params: RequestInit = {}
): Promise<{ data: any; headers: Headers }> {
  try {
    const start = performance.now();
    const response = await fetch(url, params);
    const end = performance.now();

    if (process.env.NODE_ENV === 'development') {
      logger.debug(`Fetcher: ${response.status} ${response.statusText} (${(end - start).toFixed(2)}ms)`);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return {
      data: await response.json(),
      headers: response.headers,
    };
  } catch (error) {
    logger.error('Error in fetcher:', error);
    throw error;
  }
}

/**
 * Get Next.js caching parameters based on version
 */
export function getNextCachingParams(version: 'draft' | 'published') {
  return {
    next: {
      tags: [STORYBLOK_CONFIG.cacheTags.stories],
    },
    cache: version === 'published' ? ('default' as const) : ('no-store' as const),
  };
}
