import { MetadataRoute } from 'next';
import { fetchStories } from '@/lib/storyblok';
import { env } from '@/utils';

// Enable static generation with ISR - revalidate every hour
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Always use 'published' for sitemap - sitemaps should only include published content
    const { data } = await fetchStories('published', {
      per_page: 100,
    });

    const stories = data?.stories || [];

    return stories.map((story: any) => ({
      url: `${env.app.domain}/${story.full_slug === 'home' ? '' : story.full_slug}`,
      lastModified: story.published_at ? new Date(story.published_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: story.full_slug === 'home' ? 1 : 0.8,
    }));
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [];
  }
}

