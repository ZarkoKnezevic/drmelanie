'use client';

import { useEffect, useState } from 'react';

interface ConditionalHeaderWrapperProps {
  children: React.ReactNode;
}

export function ConditionalHeaderWrapper({ children }: ConditionalHeaderWrapperProps) {
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
  }, []);

  if (shouldHide) {
    return null;
  }

  // Render children (Server Component) passed from parent
  return <>{children}</>;
}

