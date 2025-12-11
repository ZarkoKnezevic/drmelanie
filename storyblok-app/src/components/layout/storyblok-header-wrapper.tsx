import { Suspense } from 'react';
import { HeaderServerWrapper } from './header-server-wrapper';

export function StoryblokHeaderWrapper() {
  return (
    <Suspense fallback={<div className="h-16 lg:h-24 xl:h-32" />}>
      <HeaderServerWrapper />
    </Suspense>
  );
}

