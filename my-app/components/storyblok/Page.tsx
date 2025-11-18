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
  // Debug: Log nested components being rendered
  if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
    console.log('📄 Page component rendering body with', blok.body?.length || 0, 'items');
    blok.body?.forEach((nestedBlok: any, index: number) => {
      console.log(`   [${index}] Component: "${nestedBlok.component}"`);
    });
  }

  return (
    <main {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok: any) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  );
}

