import { StoryblokClient } from '@storyblok/js';

// Get access token
const accessToken = process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN;

if (!accessToken) {
  console.warn(
    '⚠️ NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN is not set. Please create a .env.local file with your Storyblok access token.'
  );
}

// Initialize Storyblok client
const storyblokClient = new StoryblokClient({
  accessToken: accessToken || '',
  cache: { type: 'memory' },
});

// Fetch story from Storyblok
export async function getStory(slug: string, version: 'draft' | 'published' = 'draft') {
  if (!accessToken) {
    console.error('Storyblok access token is missing. Please set NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN in your .env.local file.');
    return null;
  }

  try {
    const { data } = await storyblokClient.get(`cdn/stories/${slug}`, {
      version: version === 'draft' ? 'draft' : 'published',
      resolve_relations: 'featured_posts.posts',
    });

    return data?.story;
  } catch (error: any) {
    if (error.status === 401) {
      console.error(
        '❌ Storyblok authentication failed. Please check your NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN in .env.local'
      );
      console.error('   Make sure you are using a valid Preview or Public token from your Storyblok space.');
    } else {
      console.error('Error fetching story:', error.message || error);
    }
    return null;
  }
}

// Fetch all stories
export async function getStories(startsWith?: string) {
  try {
    const { data } = await storyblokClient.get('cdn/stories', {
      version: (process.env.STORYBLOK_VERSION as 'draft' | 'published') || 'draft',
      starts_with: startsWith,
    });

    return data?.stories || [];
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
}

