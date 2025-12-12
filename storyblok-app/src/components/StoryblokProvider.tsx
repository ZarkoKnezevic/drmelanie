'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { getStoryblokApi } from '@/lib/storyblok';

interface StoryblokProviderProps {
  children: ReactNode;
}

/**
 * Client-side provider for Storyblok
 * Handles client-side initialization for visual editor support
 * Prevents scroll jumps when content updates in visual editor
 */
export default function StoryblokProvider({ children }: StoryblokProviderProps) {
  const scrollPositionRef = useRef<number>(0);
  const isRestoringRef = useRef<boolean>(false);

  useEffect(() => {
    // Initialize Storyblok bridge for visual editor
    if (typeof window !== 'undefined' && (window as any).storyblok) {
      const storyblok = (window as any).storyblok;

      // Save scroll position before any updates
      const saveScrollPosition = () => {
        if (!isRestoringRef.current) {
          scrollPositionRef.current =
            window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        }
      };

      // Restore scroll position after React re-renders
      const restoreScrollPosition = () => {
        if (scrollPositionRef.current > 0) {
          isRestoringRef.current = true;

          // Use multiple strategies to ensure scroll is restored
          const restore = () => {
            window.scrollTo({
              top: scrollPositionRef.current,
              behavior: 'instant',
            });

            // Also try setting scrollTop directly as fallback
            document.documentElement.scrollTop = scrollPositionRef.current;
            document.body.scrollTop = scrollPositionRef.current;

            // Reset flag after a short delay
            setTimeout(() => {
              isRestoringRef.current = false;
            }, 100);
          };

          // Try immediately
          restore();

          // Also try after a frame
          requestAnimationFrame(() => {
            restore();
          });

          // And after a small delay to ensure DOM has updated
          setTimeout(() => {
            restore();
          }, 50);
        }
      };

      // Save scroll position before content changes
      storyblok.on(['input', 'change'], saveScrollPosition);

      // Restore scroll position after content updates
      storyblok.on(['input', 'change'], () => {
        // Wait for React to re-render, then restore scroll
        setTimeout(restoreScrollPosition, 0);
      });

      // Also listen for when the bridge is ready
      storyblok.on(['bridge:ready'], () => {
        // Bridge is ready, set up scroll preservation
        console.log('[Storyblok] Bridge ready, scroll preservation enabled');
      });
    }

    // Also save scroll position on scroll events (as backup)
    const handleScroll = () => {
      if (!isRestoringRef.current) {
        scrollPositionRef.current =
          window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Silently handle missing token - error will be shown in the page component
  getStoryblokApi();
  return <>{children}</>;
}
