import { notFound } from 'next/navigation';
import { StoryblokStory } from '@storyblok/react/rsc';
import { fetchStory, fetchStoryMetadata } from '@/lib/storyblok';
import CoreLayout from '@/components/CoreLayout';
import { env } from '@/utils';
import { STORYBLOK_CONFIG } from '@/constants';

// Force dynamic rendering since we use dynamic fetching with Storyblok
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const slug = params.slug || [];

  // Skip metadata generation for system paths and static assets
  const systemPaths = ['favicon.ico', 'favicon.png', '.well-known', 'robots.txt', 'sitemap.xml'];
  const staticExtensions = [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.webp',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
    '.css',
    '.js',
  ];
  const firstSlug = slug[0]?.toLowerCase() || '';

  if (
    systemPaths.some((path) => firstSlug.includes(path)) ||
    staticExtensions.some((ext) => firstSlug.endsWith(ext))
  ) {
    return {};
  }

  try {
    return await fetchStoryMetadata(env.storyblok.version, slug);
  } catch (error) {
    // Log error but return empty metadata to prevent 500 error
    console.error('Error generating metadata:', error);
    return {};
  }
}

export async function generateStaticParams() {
  return [];
}

export default async function DynamicPage(props: Props) {
  const params = await props.params;
  // Handle home route - if slug is undefined or empty, use 'home'
  const slug = params.slug && params.slug.length > 0 ? params.slug : ['home'];

  // Filter out system/browser requests and static assets that shouldn't be treated as Storyblok stories
  const systemPaths = ['favicon.ico', 'favicon.png', '.well-known', 'robots.txt', 'sitemap.xml'];
  const staticExtensions = [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.webp',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
    '.css',
    '.js',
  ];
  const firstSlug = slug[0]?.toLowerCase() || '';

  if (
    systemPaths.some((path) => firstSlug.includes(path)) ||
    staticExtensions.some((ext) => firstSlug.endsWith(ext))
  ) {
    notFound();
  }

  let data;
  try {
    data = await fetchStory(env.storyblok.version, slug);
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching story:', error);

    // If no token, show setup page
    const hasToken = !!env.storyblok.accessToken;
    if (!hasToken) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="mx-auto max-w-2xl p-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">Storyblok Setup Required</h1>
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="mb-2 font-semibold text-red-800">⚠️ Access Token Missing</p>
              <p className="text-sm text-red-700">
                Please configure your Storyblok access token in Vercel environment variables.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // For other errors, show a user-friendly error page
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="mx-auto max-w-2xl p-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Unable to Load Content</h1>
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="mb-2 font-semibold text-yellow-800">⚠️ Error Loading Story</p>
            <p className="text-sm text-yellow-700">
              There was an error loading the content. Please check your Storyblok configuration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data?.story) {
    // Show setup instructions if no story found and no token
    const hasToken = !!env.storyblok.accessToken;

    if (!hasToken || slug[0] === 'home') {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="mx-auto max-w-2xl p-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">Storyblok Setup Required</h1>

            {!hasToken ? (
              <>
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="mb-2 font-semibold text-red-800">⚠️ Access Token Missing</p>
                  <p className="text-sm text-red-700">
                    Please create a <code className="rounded bg-red-100 px-2 py-1">.env.local</code>{' '}
                    file with:
                  </p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-4 text-left text-green-400">
                    NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_token_here{'\n'}
                    STORYBLOK_VERSION=draft
                  </pre>
                </div>
                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-left">
                  <p className="mb-2 font-semibold text-blue-900">How to get your token:</p>
                  <ol className="list-inside list-decimal space-y-1 text-sm text-blue-800">
                    <li>Go to your Storyblok space</li>
                    <li>Navigate to Settings → Access tokens</li>
                    <li>
                      Copy your <strong>Preview token</strong> (for draft content)
                    </li>
                    <li>Paste it in your .env.local file</li>
                    <li>Restart your dev server</li>
                  </ol>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <p className="mb-2 font-semibold text-yellow-800">⚠️ Story Not Found</p>
                  <p className="text-sm text-yellow-700">
                    The access token is set, but no story was found. This could mean:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-left text-sm text-yellow-700">
                    <li>
                      The story slug &quot;{STORYBLOK_CONFIG.defaultSlug}&quot; doesn&apos;t exist
                      in your space
                    </li>
                    <li>The access token doesn&apos;t have permission to access this story</li>
                    <li>You&apos;re using a Public token but trying to access draft content</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-left">
                  <p className="mb-2 font-semibold text-blue-900">Next steps:</p>
                  <ol className="list-inside list-decimal space-y-1 text-sm text-blue-800">
                    <li>
                      Create a story with slug &quot;{STORYBLOK_CONFIG.defaultSlug}&quot; in your
                      Storyblok space
                    </li>
                    <li>Set the content type to &quot;page&quot;</li>
                    <li>
                      Make sure you&apos;re using a Preview token (not Public) for draft content
                    </li>
                  </ol>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    notFound();
  }

  const { story, links } = data.data;

  return (
    <CoreLayout version={env.storyblok.version} allResolvedLinks={links}>
      <StoryblokStory story={story} />
    </CoreLayout>
  );
}

type Props = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
