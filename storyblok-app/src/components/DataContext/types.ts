import type { StoryblokStory, StoryblokLink } from '@/types';

export interface IDataContextValues {
  allResolvedLinks: StoryblokLink[];
  globalComponentsStories: StoryblokStory[];
}

export interface IDataContextProviderProps {
  children: React.ReactNode;
  allResolvedLinks?: StoryblokLink[];
  globalComponentsStories?: StoryblokStory[];
}

