'use client';

import { useEffect } from 'react';

/**
 * Custom hook for Storyblok visual editor bridge
 * Only works in client components
 */
export function useStoryblokBridge(blok: any, id: number) {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).storyblok) {
      // Handle story updates from visual editor
      (window as any).storyblok.on(['input', 'published', 'change'], (payload: any) => {
        console.log('Story updated:', payload);
      });
    }
  }, [id]);
}

