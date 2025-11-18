import { getStory } from '@/lib/storyblok';
import StoryblokRenderer from '@/components/StoryblokRenderer';

export default async function Home() {
  // Fetch the home page story from Storyblok
  // Change 'home' to match your Storyblok story slug
  const story = await getStory('home', 'draft');

  if (!story) {
    const hasToken = !!process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN;
    
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-2xl mx-auto p-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Storyblok Setup Required</h1>
          
          {!hasToken ? (
            <>
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-semibold mb-2">⚠️ Access Token Missing</p>
                <p className="text-red-700 text-sm">
                  Please create a <code className="bg-red-100 px-2 py-1 rounded">.env.local</code> file in the <code className="bg-red-100 px-2 py-1 rounded">my-app</code> directory with:
                </p>
                <pre className="mt-3 text-left bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
                  NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_token_here{'\n'}STORYBLOK_VERSION=draft
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
                  <li>The story slug &quot;home&quot; doesn&apos;t exist in your space</li>
                  <li>The access token doesn&apos;t have permission to access this story</li>
                  <li>You&apos;re using a Public token but trying to access draft content</li>
                </ul>
              </div>
              <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold text-blue-900 mb-2">Next steps:</p>
                <ol className="list-decimal list-inside text-blue-800 text-sm space-y-1">
                  <li>Create a story with slug &quot;home&quot; in your Storyblok space</li>
                  <li>Set the content type to &quot;page&quot;</li>
                  <li>Make sure you&apos;re using a Preview token (not Public) for draft content</li>
                </ol>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Debug: Log the story content to see what component name is being used
  if (process.env.NODE_ENV === 'development') {
    console.log('📄 Story content component:', story.content?.component);
    console.log('📄 Component name type:', typeof story.content?.component);
    console.log('📄 Component name value (JSON):', JSON.stringify(story.content?.component));
    console.log('📄 Story body exists:', !!story.content?.body);
    console.log('📄 Story body length:', story.content?.body?.length);
  }

  return <StoryblokRenderer blok={story.content} />;
}
