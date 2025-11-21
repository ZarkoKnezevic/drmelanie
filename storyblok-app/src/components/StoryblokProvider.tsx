'use client';

import { ReactNode } from 'react';
import { getStoryblokApi } from '@/lib/storyblok';

interface StoryblokProviderProps {
  children: ReactNode;
}

/**
 * Client-side provider for Storyblok
 * Handles client-side initialization for visual editor support
 */
export default function StoryblokProvider({ children }: StoryblokProviderProps) {
  // Silently handle missing token - error will be shown in the page component
  getStoryblokApi();
  return <>{children}</>;
}

