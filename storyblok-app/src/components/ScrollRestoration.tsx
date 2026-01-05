'use client';

import { useEffect } from 'react';

/**
 * ScrollRestoration - Controls browser scroll restoration behavior
 * Disables automatic scroll restoration and ensures we always scroll to top on refresh
 * (except in live preview mode)
 */
export function ScrollRestoration() {
  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // On page load/refresh, scroll to top (unless in live preview)
    const isLivePreview = window.location.pathname.startsWith('/live-preview');
    
    if (!isLivePreview) {
      // Scroll to top immediately
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      if (document.body) {
        document.body.scrollTop = 0;
      }
    }
  }, []);

  return null;
}

