'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from './site-header';
import { PathnameHeaderContent } from './pathname-header-content';

export function PathnameHeader() {
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '/home';

  // On home page, use SiteHeader
  if (isHomePage) {
    return <SiteHeader />;
  }

  // On other pages, use Storyblok header
  return <PathnameHeaderContent />;
}

