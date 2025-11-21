import type { Metadata } from 'next';
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';
import { env, logger } from '@/utils';
import { COMPONENTS } from '@/constants/storyblok-components';
import { fetcher, getNextCachingParams } from './utils';
import type {
  StoryblokApiResponse,
  StoryblokStoriesResponse,
  StoryblokApiInit,
} from '@/types';

/**
 * Initialize Storyblok API
 * Lazy initialization to handle missing access token gracefully
 */
let storyblokApiInstance: ReturnType<typeof storyblokInit> | null = null;

export function getStoryblokApi() {
  if (!env.storyblok.accessToken) {
    // Return null instead of throwing to allow graceful handling
    return null;
  }

  if (!storyblokApiInstance) {
    storyblokApiInstance = storyblokInit({
      accessToken: env.storyblok.accessToken,
      use: [apiPlugin],
      components: COMPONENTS,
    } as StoryblokApiInit);
  }

  return storyblokApiInstance;
}

/**
 * Fetch a single story from Storyblok
 */
export async function fetchStory(
  version: 'draft' | 'published',
  slug?: string[]
): Promise<{ data: StoryblokApiResponse }> {
  if (!env.storyblok.accessToken) {
    return { data: { story: null, links: [] } };
  }

  getStoryblokApi();
  const correctSlug = `/${slug ? slug.join('/') : 'home'}`;

  const searchParams = new URLSearchParams({
    version,
    token: env.storyblok.accessToken,
  });

  const url = `${env.storyblok.apiGate}/stories${correctSlug}?${searchParams.toString()}`;

  try {
    const data = await fetcher(url, {
      method: 'GET',
      ...getNextCachingParams(version),
    });

    return data;
  } catch (error: any) {
    // Handle 404 errors gracefully - story not found
    if (error?.message?.includes('404') || error?.message?.includes('HTTP error! status: 404')) {
      logger.warn(`Story not found: ${correctSlug}`);
      return { data: { story: null, links: [] } };
    }
    // Re-throw other errors
    throw error;
  }
}

/**
 * Fetch multiple stories from Storyblok
 */
export async function fetchStories(
  version: 'draft' | 'published',
  params?: Record<string, string | number | boolean>
): Promise<{ data: StoryblokStoriesResponse }> {
  if (!env.storyblok.accessToken) {
    return { data: { stories: [], links: [] } };
  }

  getStoryblokApi();

  const searchParams = new URLSearchParams({
    version,
    token: env.storyblok.accessToken,
    ...params,
  });

  const url = `${env.storyblok.apiGate}/stories?${searchParams.toString()}`;

  const data = await fetcher(url, {
    method: 'GET',
    ...getNextCachingParams(version),
  });

  return data;
}

/**
 * Fetch story metadata for SEO
 */
export async function fetchStoryMetadata(
  version: 'draft' | 'published',
  slug?: string[]
): Promise<Metadata> {
  if (!env.storyblok.accessToken) {
    return {
      title: 'Storyblok Setup Required',
      description: 'Please configure your Storyblok access token',
    };
  }

  try {
    const {
      data: { story },
    } = await fetchStory(version, slug);

    if (!story) {
      logger.warn(`Missing metadata for story: ${slug?.join('/') || 'home'}`);
      return {};
    }

    const content = story.content as {
      seoTitle?: string;
      seoDescription?: string;
      ogImage?: { filename?: string };
      seoKeywords?: string;
      robots?: string;
    };

    const seoTitle = content.seoTitle || story.name || '';
    const seoDescription = content.seoDescription || '';
    const ogImage = content.ogImage;
    const seoKeywords = content.seoKeywords || '';
    const robots = content.robots;

    const openGraph: Metadata['openGraph'] = {
      title: seoTitle,
      description: seoDescription,
      images: ogImage?.filename
        ? [
            {
              url: `${ogImage.filename}/m/1200x630/filters:quality(75)`,
            },
          ]
        : [],
    };

    const correctSlug = story.full_slug === 'home' ? '' : story.full_slug;
    const canonical = new URL(`${env.app.domain}/${correctSlug}`).toString();

    return {
      alternates: {
        canonical,
      },
      metadataBase: new URL(env.app.domain),
      title: seoTitle,
      description: seoDescription,
      openGraph,
      keywords: seoKeywords,
      robots: robots === 'index' ? { index: true } : { index: false },
    };
  } catch (error) {
    // If fetchStory throws an error (other than 404 which is handled), return empty metadata
    logger.error(`Error fetching story metadata: ${error}`);
    return {};
  }
}

