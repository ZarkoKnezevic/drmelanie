// Server-side Storyblok initialization
import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';
import { COMPONENTS } from '@/constants/storyblok-components';
import { env } from '@/utils/env';
import { logger } from '@/utils/logger';

// Custom fallback component to show helpful error messages
function FallbackComponent({ blok }: { blok: any }) {
  const componentName = blok?.component || 'unknown';
  const registeredKeys = Object.keys(COMPONENTS);

  // Log detailed error info to console
  if (typeof window === 'undefined') {
    logger.error('Component not found!');
    logger.debug('Component name received:', componentName);
    logger.debug('Component name type:', typeof componentName);
    logger.debug('Component name (JSON):', JSON.stringify(componentName));
    logger.debug('Registered components:', registeredKeys);
    logger.debug('Is "page" registered?', registeredKeys.includes('page'));
    logger.debug('Is "Page" registered?', registeredKeys.includes('Page'));
  }

  return (
    <div className="my-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <p className="font-semibold text-yellow-800">
        ⚠️ Component &quot;{componentName}&quot; not found
      </p>
      <p className="mt-2 text-sm text-yellow-700">
        Make sure the component name in Storyblok matches one of these registered components:
      </p>
      <ul className="mt-2 list-inside list-disc text-sm text-yellow-700">
        {registeredKeys.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <p className="mt-2 text-sm font-semibold text-red-700">
        💡 Check the terminal console for detailed debugging information.
      </p>
    </div>
  );
}

// Initialize Storyblok for server components
// This runs at module load time on the server
// Only initialize if access token is available
if (typeof window === 'undefined') {
  if (!env.storyblok.accessToken) {
    logger.warn(
      '⚠️ Storyblok access token is missing. Please set NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN in your .env.local file.'
    );
    logger.warn(
      '📖 See: https://www.storyblok.com/docs/api/content-delivery#topics/authentication'
    );
  } else {
    try {
      storyblokInit({
        accessToken: env.storyblok.accessToken,
        use: [apiPlugin],
        components: COMPONENTS,
        enableFallbackComponent: true,
        customFallbackComponent: FallbackComponent,
        // Prevent Storyblok from reloading the page on content changes
        bridge: typeof window !== 'undefined' && process.env.NEXT_PUBLIC_IS_PREVIEW === 'true',
      });

      // Debug: Log registered components
      logger.info('Storyblok components registered:', Object.keys(COMPONENTS));
    } catch (error) {
      logger.error('Error initializing Storyblok:', error);
    }
  }
}
