import { notFound } from 'next/navigation';
import { StoryblokStory } from '@storyblok/react/rsc';
import { fetchStory, fetchStoryMetadata } from '@/lib/storyblok';
import CoreLayout from '@/components/CoreLayout';
import { env } from '@/utils';
import { STORYBLOK_CONFIG } from '@/constants';

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const slug = params.slug || [];
  
  // Skip metadata generation for system paths
  const systemPaths = ['favicon.ico', '.well-known', 'robots.txt', 'sitemap.xml'];
  const firstSlug = slug[0]?.toLowerCase() || '';
  
  if (systemPaths.some(path => firstSlug.includes(path))) {
    return {};
  }
  
  return fetchStoryMetadata(env.storyblok.version, slug);
}

export async function generateStaticParams() {
  return [];
}

export default async function DynamicPage(props: Props) {
  const params = await props.params;
  // Handle home route - if slug is undefined or empty, use 'home'
  const slug = params.slug && params.slug.length > 0 ? params.slug : ['home'];
  
  // Filter out system/browser requests that shouldn't be treated as Storyblok stories
  const systemPaths = ['favicon.ico', '.well-known', 'robots.txt', 'sitemap.xml'];
  const firstSlug = slug[0]?.toLowerCase() || '';
  
  if (systemPaths.some(path => firstSlug.includes(path))) {
    notFound();
  }
  
  const { data } = await fetchStory(env.storyblok.version, slug);

  if (!data?.story) {
    // Show setup instructions if no story found and no token
    const hasToken = !!env.storyblok.accessToken;

    if (!hasToken || slug[0] === 'home') {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="max-w-2xl mx-auto p-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              Storyblok Setup Required
            </h1>

            {!hasToken ? (
              <>
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-semibold mb-2">⚠️ Access Token Missing</p>
                  <p className="text-red-700 text-sm">
                    Please create a <code className="bg-red-100 px-2 py-1 rounded">.env.local</code>{' '}
                    file with:
                  </p>
                  <pre className="mt-3 text-left bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
                    NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_token_here{'\n'}
                    STORYBLOK_VERSION=draft
                  </pre>
                </div>
                <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="font-semibold text-blue-900 mb-2">How to get your token:</p>
                  <ol className="list-decimal list-inside text-blue-800 text-sm space-y-1">
                    <li>Go to your Storyblok space</li>
                    <li>Navigate to Settings → Access tokens</li>
                    <li>Copy your <strong>Preview token</strong> (for draft content)</li>
                    <li>Paste it in your .env.local file</li>
                    <li>Restart your dev server</li>
                  </ol>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 font-semibold mb-2">⚠️ Story Not Found</p>
                  <p className="text-yellow-700 text-sm">
                    The access token is set, but no story was found. This could mean:
                  </p>
                  <ul className="text-left mt-2 text-yellow-700 text-sm space-y-1 list-disc list-inside">
                    <li>
                      The story slug &quot;{STORYBLOK_CONFIG.defaultSlug}&quot; doesn&apos;t exist in
                      your space
                    </li>
                    <li>The access token doesn&apos;t have permission to access this story</li>
                    <li>You&apos;re using a Public token but trying to access draft content</li>
                  </ul>
                </div>
                <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-semibold text-blue-900 mb-2">Next steps:</p>
                  <ol className="list-decimal list-inside text-blue-800 text-sm space-y-1">
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

  const { story, links } = data;

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

