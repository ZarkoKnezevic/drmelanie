'use client';

import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';
import { ReactNode, useEffect } from 'react';
import { components } from '@/lib/storyblok-components';

// Custom fallback component for client side
function FallbackComponent({ blok }: { blok: any }) {
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg my-4">
      <p className="text-yellow-800 font-semibold">
        ⚠️ Component &quot;{blok?.component || 'unknown'}&quot; not found
      </p>
      <p className="text-yellow-700 text-sm mt-2">
        Make sure the component name in Storyblok matches one of these registered components:
      </p>
      <ul className="list-disc list-inside text-yellow-700 text-sm mt-2">
        {Object.keys(components).map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}

interface StoryblokProviderProps {
  children: ReactNode;
}

export default function StoryblokProvider({ children }: StoryblokProviderProps) {
  useEffect(() => {
    // Initialize Storyblok on the client side
    storyblokInit({
      accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN || '',
      use: [apiPlugin],
      components,
      enableFallbackComponent: true,
      customFallbackComponent: FallbackComponent,
    });
  }, []);

  return <>{children}</>;
}

