import { fetchStories } from '@/lib/storyblok';
import { DataContextProvider } from '@/components/DataContext';
import { env } from '@/utils';
import type { StoryblokStory, StoryblokLink } from '@/types';

interface ICoreLayoutProps {
  children: React.ReactNode;
  version: 'draft' | 'published';
  allResolvedLinks?: StoryblokLink[];
}

export default async function CoreLayout({
  children,
  version,
  allResolvedLinks = [],
}: ICoreLayoutProps) {
  let globalComponentsStories: StoryblokStory[] = [];

  try {
    const { data } = await fetchStories(version, {
      by_slugs: 'components/*',
    });
    globalComponentsStories = data?.stories || [];
  } catch (error) {
    // Log error but don't fail the page render
    console.error('Error fetching global components:', error);
    // Continue with empty array - page will still render
  }

  return (
    <DataContextProvider
      globalComponentsStories={globalComponentsStories}
      allResolvedLinks={allResolvedLinks}
    >
      {children}
    </DataContextProvider>
  );
}

