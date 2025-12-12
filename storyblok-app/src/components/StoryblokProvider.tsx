'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { getStoryblokApi } from '@/lib/storyblok';

interface StoryblokProviderProps {
  children: ReactNode;
}

const SCROLL_POSITION_KEY = 'storyblok-scroll-position';

/**
 * Client-side provider for Storyblok
 * Handles client-side initialization for visual editor support
 * Prevents scroll jumps when content updates in visual editor
 */
export default function StoryblokProvider({ children }: StoryblokProviderProps) {
  const scrollPositionRef = useRef<number>(0);
  const isRestoringRef = useRef<boolean>(false);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    // Restore scroll position from sessionStorage on mount (survives page reloads)
    const restoreFromStorage = () => {
      try {
        const saved = sessionStorage.getItem(SCROLL_POSITION_KEY);
        if (saved) {
          const position = parseInt(saved, 10);
          if (position > 0) {
            scrollPositionRef.current = position;
            isRestoringRef.current = true;

            // Restore immediately and multiple times
            const restore = () => {
              window.scrollTo({
                top: position,
                behavior: 'instant',
              });
              document.documentElement.scrollTop = position;
              if (document.body) {
                document.body.scrollTop = position;
              }
            };

            restore();
            requestAnimationFrame(() => {
              restore();
              requestAnimationFrame(() => {
                restore();
              });
            });
            setTimeout(restore, 0);
            setTimeout(restore, 50);
            setTimeout(restore, 100);

            setTimeout(() => {
              isRestoringRef.current = false;
            }, 200);
          }
        }
      } catch (e) {
        // Ignore errors
      }
    };

    // Restore on mount
    restoreFromStorage();

    // Initialize Storyblok bridge for visual editor
    if (typeof window !== 'undefined') {
      // Save scroll position (to both ref and sessionStorage)
      const saveScrollPosition = () => {
        if (!isRestoringRef.current) {
          const position =
            window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
          scrollPositionRef.current = position;
          try {
            sessionStorage.setItem(SCROLL_POSITION_KEY, position.toString());
          } catch (e) {
            // Ignore errors
          }
        }
      };

      // Restore scroll position aggressively
      const restoreScrollPosition = () => {
        const savedPosition = scrollPositionRef.current;
        if (savedPosition > 0) {
          isRestoringRef.current = true;

          const restore = () => {
            try {
              window.scrollTo({
                top: savedPosition,
                behavior: 'instant',
              });
              document.documentElement.scrollTop = savedPosition;
              if (document.body) {
                document.body.scrollTop = savedPosition;
              }
            } catch (e) {
              // Ignore errors
            }
          };

          // Multiple restoration attempts
          restore();
          requestAnimationFrame(() => {
            restore();
            requestAnimationFrame(() => {
              restore();
            });
          });
          setTimeout(restore, 0);
          setTimeout(restore, 10);
          setTimeout(restore, 50);
          setTimeout(restore, 100);
          setTimeout(restore, 200);
          setTimeout(restore, 300);

          setTimeout(() => {
            isRestoringRef.current = false;
          }, 400);
        }
      };

      // Wait for Storyblok bridge to be available
      const initBridge = () => {
        if ((window as any).storyblok) {
          const storyblok = (window as any).storyblok;

          // Save scroll position before content changes
          storyblok.on(['input', 'change'], saveScrollPosition);

          // Restore scroll position after content updates
          storyblok.on(['input', 'change'], () => {
            setTimeout(restoreScrollPosition, 0);
            setTimeout(restoreScrollPosition, 50);
            setTimeout(restoreScrollPosition, 100);
            setTimeout(restoreScrollPosition, 200);
          });

          // Listen for bridge ready
          storyblok.on(['bridge:ready'], () => {
            console.log('[Storyblok] Bridge ready, scroll preservation enabled');
            // Restore scroll when bridge is ready
            restoreScrollPosition();
          });
        }
      };

      // Try to initialize immediately
      initBridge();

      // Also try after delays in case bridge loads later
      const timer1 = setTimeout(initBridge, 500);
      const timer2 = setTimeout(initBridge, 1000);
      const timer3 = setTimeout(initBridge, 2000);

      // Use MutationObserver to detect DOM changes and restore scroll
      observerRef.current = new MutationObserver(() => {
        if (scrollPositionRef.current > 0 && !isRestoringRef.current) {
          setTimeout(() => {
            const savedPosition = scrollPositionRef.current;
            if (savedPosition > 0) {
              window.scrollTo({
                top: savedPosition,
                behavior: 'instant',
              });
            }
          }, 0);
        }
      });

      // Observe document body for changes
      if (document.body) {
        observerRef.current.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: false,
        });
      }

      // Save scroll position on scroll events
      const handleScroll = () => {
        if (!isRestoringRef.current) {
          saveScrollPosition();
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      // Save on beforeunload/pagehide (before page reloads)
      window.addEventListener('beforeunload', saveScrollPosition);
      window.addEventListener('pagehide', saveScrollPosition);

      // Also restore scroll on focus (in case iframe refocuses)
      window.addEventListener('focus', restoreScrollPosition);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('beforeunload', saveScrollPosition);
        window.removeEventListener('pagehide', saveScrollPosition);
        window.removeEventListener('focus', restoreScrollPosition);
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }
  }, []);

  // Silently handle missing token - error will be shown in the page component
  getStoryblokApi();
  return <>{children}</>;
}
