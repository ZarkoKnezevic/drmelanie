'use client';

import { useEffect, useState } from 'react';

interface ConditionalFooterWrapperProps {
  children: React.ReactNode;
}

export function ConditionalFooterWrapper({ children }: ConditionalFooterWrapperProps) {
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    // Use MutationObserver to watch for data attributes on the body or main element
    const checkForSpecialPages = () => {
      const isNotFound = document.querySelector('[data-not-found]') !== null;
      setShouldHide(isNotFound);
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
        attributeFilter: ['data-not-found'],
      });
    }

    return () => observer.disconnect();
  }, []);

  if (shouldHide) {
    return null;
  }

  return <>{children}</>;
}

