import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchStory, fetchStoryMetadata } from '@/lib/storyblok';
import StoryClient from './StoryClient';

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  return fetchStoryMetadata('draft', params.slug);
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LivePreviewPage(props: Props) {
  const params = await props.params;

  // Allow preview in Vercel preview deployments or when explicitly enabled
  const isPreviewEnabled =
    process.env.NEXT_PUBLIC_IS_PREVIEW === 'true' ||
    process.env.VERCEL_ENV === 'preview' ||
    process.env.VERCEL_ENV === 'development';

  if (!isPreviewEnabled) {
    notFound();
  }

  const { data } = await fetchStory('draft', params.slug);

  if (!data?.story) {
    notFound();
  }

  const { story, links } = data;

  // Server component fetches story, client component handles live updates
  // This prevents Server Component re-execution = no scroll reset!
  return <StoryClient initialStory={story} links={links} />;
}

type Props = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

