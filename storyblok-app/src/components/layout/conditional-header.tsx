'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SiteHeader } from './site-header';

export function ConditionalHeader() {
  const pathname = usePathname();
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    // Use MutationObserver to watch for data attributes on the body or main element
    const checkForSpecialPages = () => {
      const isNotFound = document.querySelector('[data-not-found]') !== null;
      const isLoading = document.querySelector('[data-loading]') !== null;
      setShouldHide(isNotFound || isLoading);
    };

    // Check immediately
    checkForSpecialPages();

    // Watch for changes in the DOM
    const observer = new MutationObserver(checkForSpecialPages);
    
    // Observe the body for changes
    if (typeof document !== 'undefined') {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-not-found', 'data-loading'],
      });
    }

    return () => observer.disconnect();
  }, [pathname]);

  if (shouldHide) {
    return null;
  }

  return <SiteHeader />;
}

