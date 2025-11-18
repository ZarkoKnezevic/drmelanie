// Server-side Storyblok initialization
import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';
import { components } from './storyblok-components';

// Custom fallback component to show helpful error messages
function FallbackComponent({ blok }: { blok: any }) {
  const componentName = blok?.component || 'unknown';
  const registeredKeys = Object.keys(components);
  
  // Log detailed error info to console
  if (typeof window === 'undefined') {
    console.error('❌ Component not found!');
    console.error('   Component name received:', componentName);
    console.error('   Component name type:', typeof componentName);
    console.error('   Component name (JSON):', JSON.stringify(componentName));
    console.error('   Registered components:', registeredKeys);
    console.error('   Is "page" registered?', registeredKeys.includes('page'));
    console.error('   Is "Page" registered?', registeredKeys.includes('Page'));
  }
  
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg my-4">
      <p className="text-yellow-800 font-semibold">
        ⚠️ Component &quot;{componentName}&quot; not found
      </p>
      <p className="text-yellow-700 text-sm mt-2">
        Make sure the component name in Storyblok matches one of these registered components:
      </p>
      <ul className="list-disc list-inside text-yellow-700 text-sm mt-2">
        {registeredKeys.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <p className="text-red-700 text-sm mt-2 font-semibold">
        💡 Check the terminal console for detailed debugging information.
      </p>
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

