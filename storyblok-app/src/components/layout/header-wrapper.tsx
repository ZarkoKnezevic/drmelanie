'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SiteHeader } from './site-header';

interface HeaderWrapperProps {
  storyblokHeader: React.ReactNode;
}

export function HeaderWrapper({ storyblokHeader }: HeaderWrapperProps) {
  const pathname = usePathname();
  
  useEffect(() => {
    // Add class to body based on pathname
    const isHomePage = pathname === '/' || pathname === '/home';
    
    if (isHomePage) {
      document.body.classList.add('is-home-page');
      document.body.classList.remove('is-inner-page');
    } else {
      document.body.classList.add('is-inner-page');
      document.body.classList.remove('is-home-page');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('is-home-page', 'is-inner-page');
    };
  }, [pathname]);

  return (
    <>
      {/* SiteHeader - visible only on home page */}
      <div className="header-site-header">
        <SiteHeader />
      </div>

      {/* Storyblok Header - visible only on inner pages */}
      <div className="header-storyblok">
        {storyblokHeader}
      </div>
    </>
  );
}
