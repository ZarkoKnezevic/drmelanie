import { NextRequest } from 'next/server';
import { fetchStories } from '@/lib/storyblok/storyblok';

/**
 * GET handler for fetching Storyblok stories
 * Used by live preview to fetch global components client-side
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Extract query parameters
  const version = (searchParams.get('version') || 'published') as 'draft' | 'published';
  const bySlugs = searchParams.get('by_slugs');
  
  // Build params object for fetchStories
  const params: Record<string, string> = {};
  if (bySlugs) {
    params.by_slugs = bySlugs;
  }
  
  try {
    const { data } = await fetchStories(version, params);
    
    // Return stories array (matching what StoryClient expects)
    return Response.json({
      stories: data.stories || [],
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return Response.json(
      { error: 'Failed to fetch stories', stories: [] },
      { status: 500 }
    );
  }
}
