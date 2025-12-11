'use client';

import { useEffect, useState } from 'react';
import { LottieAnimation } from '@/components/ui/components/lottie-animation';
import { getLottiePath } from '@/lib/lottie/animations';
import { useLoading } from '@/contexts/loading-context';
import { cn } from '@/utils';

export function InitialLoading() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [startTime] = useState(Date.now());
  const { setInitialLoadingComplete } = useLoading();
  const MIN_DISPLAY_TIME = 2500; // Minimum 2.5 seconds to see the animation

  useEffect(() => {
    let animationReady = false;
    let pageLoaded = false;
    let animationTimeout: NodeJS.Timeout | null = null;
    let hasHeroMediaVideo = false;

    // Check if HeroMediaVideo exists on the page
    const checkForHeroMediaVideo = () => {
      // Check if there's a hero-media section or HeroMediaVideo component
      const heroMediaSection = document.querySelector('.hero-media, [class*="hero-media"]');
      hasHeroMediaVideo = !!heroMediaSection;
      return hasHeroMediaVideo;
    };

    // Hide loading once React has hydrated and page is ready
    const hideLoading = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsed);

      setTimeout(() => {
        // Force scroll to top before showing content
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // Reset Lenis if it exists
        if (typeof window !== 'undefined' && (window as any).__lenis__) {
          (window as any).__lenis__.scrollTo(0, { immediate: true });
        }

        // Notify that initial loading is complete (so Banner can start animating)
        setInitialLoadingComplete();
        // Start fade-out transition
        setIsFadingOut(true);
        // Remove from DOM after fade-out completes
        setTimeout(() => {
          setIsLoading(false);
          // Ensure scroll is still at top after loading screen is gone
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }, 500); // Match transition duration
      }, remainingTime);
    };

    const checkReady = () => {
      if (!pageLoaded) return;

      // If HeroMediaVideo exists, wait for animation ready event
      if (hasHeroMediaVideo) {
        if (animationReady) {
          hideLoading();
        }
        // Don't proceed without animation ready if HeroMediaVideo exists
      } else {
        // No HeroMediaVideo - proceed after page load
        hideLoading();
      }
    };

    // Listen for animation ready event (only fires if HeroMediaVideo exists)
    const handleAnimationReady = () => {
      if (animationTimeout) {
        clearTimeout(animationTimeout);
        animationTimeout = null;
      }
      animationReady = true;
      hasHeroMediaVideo = true; // Confirm HeroMediaVideo exists
      checkReady();
    };

    if (typeof window !== 'undefined') {
      // Listen for animation ready event
      window.addEventListener('hero-animation-ready', handleAnimationReady, { once: true });

      // Check for HeroMediaVideo after a short delay (to allow DOM to render)
      setTimeout(() => {
        checkForHeroMediaVideo();
        // If no HeroMediaVideo found and page is loaded, proceed after 1.5s
        if (!hasHeroMediaVideo && pageLoaded) {
          animationTimeout = setTimeout(() => {
            hideLoading();
          }, 1500);
        }
      }, 100);

      if (document.readyState === 'complete') {
        // Page already loaded
        pageLoaded = true;
        checkReady();
      } else {
        // Wait for page load event
        const handlePageLoad = () => {
          pageLoaded = true;
          // If no HeroMediaVideo, proceed after short delay
          if (!hasHeroMediaVideo) {
            animationTimeout = setTimeout(() => {
              hideLoading();
            }, 1500);
          }
          checkReady();
        };
        window.addEventListener('load', handlePageLoad, { once: true });

        // Safety timeout to prevent stuck loading (max 8 seconds)
        const timeout = setTimeout(() => {
          pageLoaded = true;
          animationReady = true; // Force ready if timeout
          if (animationTimeout) clearTimeout(animationTimeout);
          hideLoading();
        }, 8000);

        return () => {
          window.removeEventListener('load', handlePageLoad);
          window.removeEventListener('hero-animation-ready', handleAnimationReady);
          clearTimeout(timeout);
          if (animationTimeout) clearTimeout(animationTimeout);
        };
      }
    }
  }, [startTime, setInitialLoadingComplete]);

  if (!isLoading) {
    return null;
  }

  return (
    <div
      data-loading
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ease-in-out',
        isFadingOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="h-64 w-64">
        <LottieAnimation src={getLottiePath('stork')} className="h-full w-full" />
      </div>
    </div>
  );
}
