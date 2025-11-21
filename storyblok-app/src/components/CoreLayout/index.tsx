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
  const { data } = await fetchStories(version, {
    by_slugs: 'components/*',
  });

  const globalComponentsStories = data?.stories || [];

  return (
    <DataContextProvider
      globalComponentsStories={globalComponentsStories}
      allResolvedLinks={allResolvedLinks}
    >
      {children}
    </DataContextProvider>
  );
}

