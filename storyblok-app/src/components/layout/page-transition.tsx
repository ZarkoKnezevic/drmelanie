'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    // Only reset scroll if pathname actually changed (not on initial mount)
    if (prevPathnameRef.current !== null && prevPathnameRef.current !== pathname) {
      // Force scroll to top immediately on navigation
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Reset Lenis scroll if it exists
      if (typeof window !== 'undefined') {
        // Try to find Lenis instance from HeroMediaVideo
        const lenisInstance = (window as any).__lenis__;
        if (lenisInstance) {
          lenisInstance.scrollTo(0, { immediate: true });
        }
      }

      // Reset ScrollTrigger scroll positions
      if (typeof window !== 'undefined' && (window as any).ScrollTrigger) {
        (window as any).ScrollTrigger.getAll().forEach((trigger: any) => {
          trigger.refresh();
        });
      }
    }
    
    prevPathnameRef.current = pathname;

    // Small delay to ensure smooth fade-in after loading
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`transition-opacity duration-500 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
}

