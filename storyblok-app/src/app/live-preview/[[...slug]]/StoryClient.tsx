'use client';

import { StoryblokComponent, useStoryblokState } from '@storyblok/react';
import { DataContextProvider } from '@/components/DataContext';
import { useEffect, useState, useRef } from 'react';

/**
 * Client component for Storyblok live preview
 * Only the content updates, not the entire page
 * This prevents scroll resets
 */
export default function StoryClient({ initialStory, links }: { initialStory: any; links?: any[] }) {
  const [globalComponents, setGlobalComponents] = useState<any[]>([]);
  const scrollPositionRef = useRef<number>(0);
  const isInitialMountRef = useRef<boolean>(true);
  const storyIdRef = useRef<string | number | undefined>(initialStory?.id);
  const storageKey = `scroll-pos-${initialStory?.id || 'preview'}`;

  // Fetch global components client-side (only once)
  useEffect(() => {
    fetch('/api/storyblok/stories?by_slugs=components/*&version=draft')
      .then((res) => res.json())
      .then((data) => {
        if (data.stories) {
          setGlobalComponents(data.stories);
        }
      })
      .catch(console.error);
  }, []);

  // Restore scroll position from sessionStorage on mount (handles page reloads/compilations)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedPosition = sessionStorage.getItem(storageKey);
    if (savedPosition) {
      const position = parseInt(savedPosition, 10);
      scrollPositionRef.current = position;

      // Restore scroll position after a short delay to ensure DOM is ready
      const restoreScroll = () => {
        if (position > 0) {
          window.scrollTo({
            top: position,
            left: 0,
            behavior: 'instant',
          });

          // Also handle Lenis smooth scroll if present
          const lenisInstance = (window as any).__lenis__;
          if (lenisInstance) {
            lenisInstance.scrollTo(position, { immediate: true });
          }
        }
      };

      // Use multiple requestAnimationFrame calls to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          restoreScroll();
        });
      });
    }
  }, [storageKey]);

  // Save scroll position continuously to both ref and sessionStorage
  useEffect(() => {
    const saveScrollPosition = () => {
      const position = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      scrollPositionRef.current = position;

      // Save to sessionStorage for persistence across reloads
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(storageKey, position.toString());
      }
    };

    // Save scroll position on scroll (throttled)
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          saveScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Save initial scroll position
    saveScrollPosition();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [storageKey]);

  // useStoryblokState updates only the story content, not the entire component tree
  const story = useStoryblokState(initialStory);

  // Restore scroll position after story content updates (but not on initial mount)
  useEffect(() => {
    // Skip restoration on initial mount
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      storyIdRef.current = story?.id;
      return;
    }

    // Only restore if it's the same story (content update, not navigation)
    if (story?.id !== storyIdRef.current) {
      storyIdRef.current = story?.id;
      // Clear scroll position on story change (new page)
      scrollPositionRef.current = 0;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(storageKey);
      }
      return;
    }

    // Restore scroll position after content updates
    const restoreScroll = () => {
      const position = scrollPositionRef.current;
      if (position > 0) {
        window.scrollTo({
          top: position,
          left: 0,
          behavior: 'instant',
        });

        // Also handle Lenis smooth scroll if present
        if (typeof window !== 'undefined') {
          const lenisInstance = (window as any).__lenis__;
          if (lenisInstance) {
            lenisInstance.scrollTo(position, { immediate: true });
          }
        }
      }
    };

    // Use double requestAnimationFrame to ensure DOM is fully updated
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        restoreScroll();
      });
    });
  }, [story, storageKey]);

  // Render content without keys that would cause remounts
  // Use DataContextProvider directly instead of CoreLayout (which is Server Component)
  if (!story?.content) {
    return null;
  }

  return (
    <DataContextProvider globalComponentsStories={globalComponents} allResolvedLinks={links || []}>
      <StoryblokComponent blok={story.content} />
    </DataContextProvider>
  );
}
