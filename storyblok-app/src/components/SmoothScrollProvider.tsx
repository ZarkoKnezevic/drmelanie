'use client';

import { ReactNode, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

/**
 * SmoothScrollProvider - Initializes Lenis once at the root level
 * Prevents re-initialization on Storyblok preview updates
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Don't re-init if already initialized
    if (lenisRef.current) return;

    // Only initialize on desktop (not mobile/tablet)
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      syncTouch: true,
      lerp: 0.1,
    });

    lenisRef.current = lenis;

    // Store globally for other components to access
    if (typeof window !== 'undefined') {
      (window as Window & { __lenis__?: Lenis }).__lenis__ = lenis;
    }

    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update();
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    // Fine-tuned lag smoothing
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        if (typeof window !== 'undefined') {
          delete (window as Window & { __lenis__?: Lenis }).__lenis__;
        }
      }
    };
  }, []); // Empty deps - only initialize once

  return <div data-lenis-root>{children}</div>;
}


