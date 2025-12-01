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

    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        // Page already loaded, wait for minimum display time
        hideLoading();
      } else {
        // Wait for page load event
        window.addEventListener('load', hideLoading, { once: true });
        // Safety timeout to prevent stuck loading (max 5 seconds)
        const timeout = setTimeout(hideLoading, 5000);
        return () => {
          window.removeEventListener('load', hideLoading);
          clearTimeout(timeout);
        };
      }
    }
  }, [startTime]);

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
      <div className="w-64 h-64">
        <LottieAnimation
          src={getLottiePath('stork')}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

