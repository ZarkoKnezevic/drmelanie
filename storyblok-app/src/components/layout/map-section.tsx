import { Suspense } from 'react';
import { InteractiveGoogleMap } from '@/components/ui/InteractiveGoogleMap';
import { getGlobalSettings } from '@/lib/storyblok/getGlobalSettings';
import { cn } from '@/utils';

interface MapSectionProps {
  mapLink?: string;
}

export async function MapContent() {
  const settings = await getGlobalSettings();
  const footer = settings.footer as {
    name?: string;
    practice?: string;
    address?: string;
    postal_code?: number | string;
    city?: string;
    email?: string | { linktype?: 'story' | 'url' | 'email'; url?: string; cached_url?: string };
    phone?: string;
  } | null;

  // Extract email string from footer
  let emailString = '';
  if (footer?.email) {
    if (typeof footer.email === 'string') {
      emailString = footer.email.replace('mailto:', '');
    } else if (footer.email.url) {
      emailString = footer.email.url.replace('mailto:', '');
    } else if (footer.email.cached_url) {
      emailString = footer.email.cached_url.replace('mailto:', '');
    }
  }

  // Build address from footer data
  const address = footer?.address
    ? `${footer.address}, ${footer.postal_code || ''} ${footer.city || ''}`.trim()
    : 'Traundorferstrasse 12, 4030 Linz, Austria';

  return (
    <InteractiveGoogleMap
      address={address}
      name={footer?.name}
      practice={footer?.practice}
      addressLine={footer?.address}
      postalCode={footer?.postal_code}
      city={footer?.city}
      email={emailString}
      phone={footer?.phone}
      className="h-[500px] w-full md:h-[600px] lg:h-[700px]"
      height="100%"
    />
  );
}


export function MapSection({ mapLink }: MapSectionProps) {
  return (
    <section className="w-full">
      <div className="container py-10 md:py-12">
        <h2 className="mb-6 text-center text-h2 font-semibold text-[#3a3a3a] md:mb-8">
          Hier finden Sie uns
        </h2>
      </div>
      <div className="relative w-full overflow-hidden">
        <Suspense
          fallback={
            <div className="flex h-[500px] items-center justify-center bg-gray-100 md:h-[600px] lg:h-[700px]">
              <p className="text-sm text-gray-500">Karte wird geladen...</p>
            </div>
          }
        >
          <MapContent />
        </Suspense>
      </div>
    </section>
  );
}

