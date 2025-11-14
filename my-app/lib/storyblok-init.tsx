// Server-side Storyblok initialization
import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';
import { components } from './storyblok-components';

// Custom fallback component to show helpful error messages
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

// Initialize Storyblok for server components
const initResult = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN || '',
  use: [apiPlugin],
  components,
  enableFallbackComponent: true,
  customFallbackComponent: FallbackComponent,
});

// Debug: Log registered components
if (typeof window === 'undefined') {
  console.log('📦 Storyblok components registered:', Object.keys(components));
}

