'use client';

import { StoryblokServerComponent, storyblokEditable } from '@storyblok/react/rsc';

interface PageProps {
  blok: {
    _uid: string;
    component: string;
    body?: any[];
    [key: string]: any;
  };
}

export default function Page({ blok }: PageProps) {
  return (
    <main {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok: any) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  );
}

