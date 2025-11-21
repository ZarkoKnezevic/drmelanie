'use client';

import { createContext, use } from 'react';
import type { StoryblokStory, StoryblokLink } from '@/types';

interface IDataContextValues {
  allResolvedLinks: StoryblokLink[];
  globalComponentsStories: StoryblokStory[];
}

interface IDataContextProviderProps {
  children: React.ReactNode;
  allResolvedLinks?: StoryblokLink[];
  globalComponentsStories?: StoryblokStory[];
}

export const DataContext = createContext<IDataContextValues>({
  allResolvedLinks: [],
  globalComponentsStories: [],
});

export function DataContextProvider({
  children,
  allResolvedLinks = [],
  globalComponentsStories = [],
}: IDataContextProviderProps) {
  return (
    <DataContext.Provider
      value={{
        allResolvedLinks,
        globalComponentsStories,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useDataContext = () => {
  return use(DataContext);
};

