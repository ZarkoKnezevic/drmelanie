'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { getStoryblokApi } from '@/lib/storyblok';

interface StoryblokProviderProps {
  children: ReactNode;
}

const SCROLL_POSITION_KEY = 'storyblok-scroll-position';

// Global scroll restoration function that can be called from anywhere
let globalScrollRestore: (() => void) | null = null;

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
    // Aggressive scroll restoration function
    const restoreScrollPosition = (position?: number) => {
      const targetPosition = position ?? scrollPositionRef.current;
      if (targetPosition > 0) {
        isRestoringRef.current = true;

        const restore = () => {
          try {
            window.scrollTo({
              top: targetPosition,
              behavior: 'instant',
            });
            document.documentElement.scrollTop = targetPosition;
            if (document.body) {
              document.body.scrollTop = targetPosition;
            }
          } catch (e) {
            // Ignore errors
          }
        };

        // Immediate restoration
        restore();

        // Multiple attempts with different timings
        requestAnimationFrame(() => {
          restore();
          requestAnimationFrame(() => {
            restore();
            requestAnimationFrame(() => {
              restore();
            });
          });
        });

        // Delayed attempts
        setTimeout(restore, 0);
        setTimeout(restore, 10);
        setTimeout(restore, 50);
        setTimeout(restore, 100);
        setTimeout(restore, 200);
        setTimeout(restore, 300);
        setTimeout(restore, 500);
        setTimeout(restore, 1000);

        setTimeout(() => {
          isRestoringRef.current = false;
        }, 1200);
      }
    };

    // Set global restore function
    globalScrollRestore = restoreScrollPosition;

    // Restore scroll position from sessionStorage on mount (survives page reloads)
    const restoreFromStorage = () => {
      try {
        const saved = sessionStorage.getItem(SCROLL_POSITION_KEY);
        if (saved) {
          const position = parseInt(saved, 10);
          if (position > 0) {
            scrollPositionRef.current = position;
            restoreScrollPosition(position);
          }
        }
      } catch (e) {
        // Ignore errors
      }
    };

    // Restore on mount - multiple times to catch different load states
    restoreFromStorage();
    setTimeout(restoreFromStorage, 0);
    setTimeout(restoreFromStorage, 100);
    setTimeout(restoreFromStorage, 500);

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

      // Wait for Storyblok bridge to be available
      const initBridge = () => {
        if ((window as any).storyblok) {
          const storyblok = (window as any).storyblok;

          // Save scroll position before content changes
          storyblok.on(['input', 'change'], saveScrollPosition);

          // Prevent Storyblok from reloading the page
          // Try to intercept navigation/reload events
          const originalReload = window.location.reload;
          window.location.reload = function () {
            saveScrollPosition();
            return originalReload.apply(this, arguments as any);
          };

          // Intercept pushState/replaceState to prevent navigation
          const originalPushState = history.pushState;
          const originalReplaceState = history.replaceState;

          history.pushState = function (...args) {
            saveScrollPosition();
            const result = originalPushState.apply(this, args);
            setTimeout(() => restoreScrollPosition(), 0);
            return result;
          };

          history.replaceState = function (...args) {
            saveScrollPosition();
            const result = originalReplaceState.apply(this, args);
            setTimeout(() => restoreScrollPosition(), 0);
            return result;
          };

          // Restore scroll position after content updates
          storyblok.on(['input', 'change'], () => {
            setTimeout(() => restoreScrollPosition(), 0);
            setTimeout(() => restoreScrollPosition(), 50);
            setTimeout(() => restoreScrollPosition(), 100);
            setTimeout(() => restoreScrollPosition(), 200);
            setTimeout(() => restoreScrollPosition(), 500);
          });

          // Listen for bridge ready
          storyblok.on(['bridge:ready'], () => {
            console.log('[Storyblok] Bridge ready, scroll preservation enabled');
            // Restore scroll when bridge is ready
            setTimeout(() => restoreScrollPosition(), 0);
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
      observerRef.current = new MutationObserver((mutations) => {
        // Only restore if we have a saved position and not currently restoring
        if (scrollPositionRef.current > 0 && !isRestoringRef.current) {
          // Check if mutations are significant (not just attribute changes)
          const hasSignificantChanges = mutations.some(
            (mutation) => mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0
          );

          if (hasSignificantChanges) {
            setTimeout(() => {
              restoreScrollPosition();
            }, 0);
            setTimeout(() => {
              restoreScrollPosition();
            }, 50);
            setTimeout(() => {
              restoreScrollPosition();
            }, 100);
          }
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
      window.addEventListener('focus', () => {
        setTimeout(() => restoreScrollPosition(), 0);
      });

      // Restore scroll on every possible event that might cause scroll reset
      const events = ['load', 'DOMContentLoaded', 'pageshow', 'focus', 'visibilitychange'];
      events.forEach((event) => {
        window.addEventListener(event, () => {
          setTimeout(() => restoreScrollPosition(), 0);
          setTimeout(() => restoreScrollPosition(), 100);
        });
      });

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
