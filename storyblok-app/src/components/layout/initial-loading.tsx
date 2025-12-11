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

    // Hide loading once React has hydrated and page is ready
    const hideLoading = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsed);

      setTimeout(() => {
        // Notify that initial loading is complete (so Banner can start animating)
        setInitialLoadingComplete();
        // Start fade-out transition
        setIsFadingOut(true);
        // Remove from DOM after fade-out completes
        setTimeout(() => {
          setIsLoading(false);
        }, 500); // Match transition duration
      }, remainingTime);
    };

    const checkReady = () => {
      // Wait for page load, and animation ready (if HeroMediaVideo exists)
      // If no HeroMediaVideo on page, animationReady stays false but we proceed anyway after page load
      if (pageLoaded) {
        // If animation hasn't fired after 1.5s, assume no HeroMediaVideo and proceed
        if (!animationReady && animationTimeout === null) {
          animationTimeout = setTimeout(() => {
            animationReady = true; // Mark as ready even without event
            hideLoading();
          }, 1500); // Give HeroMediaVideo 1.5s to fire, then proceed
        } else if (animationReady) {
          hideLoading();
        }
      }
    };

    // Listen for animation ready event (optional - only if HeroMediaVideo exists)
    const handleAnimationReady = () => {
      if (animationTimeout) {
        clearTimeout(animationTimeout);
        animationTimeout = null;
      }
      animationReady = true;
      checkReady();
    };

    if (typeof window !== 'undefined') {
      // Listen for animation ready event (optional)
      window.addEventListener('hero-animation-ready', handleAnimationReady, { once: true });

      if (document.readyState === 'complete') {
        // Page already loaded
        pageLoaded = true;
        checkReady();
      } else {
        // Wait for page load event
        const handlePageLoad = () => {
          pageLoaded = true;
          checkReady();
        };
        window.addEventListener('load', handlePageLoad, { once: true });

        // Safety timeout to prevent stuck loading (max 5 seconds - reduced from 8)
        const timeout = setTimeout(() => {
          pageLoaded = true;
          animationReady = true; // Force ready if timeout
          if (animationTimeout) clearTimeout(animationTimeout);
          hideLoading();
        }, 5000);

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
