import Image from 'next/image';
import { env } from '@/utils';

interface StaticGoogleMapProps {
  address: string;
  width?: number;
  height?: number;
  zoom?: number;
  className?: string;
  alt?: string;
}

/**
 * Generates a static Google Map with custom styling and marker
 * Uses Google Maps Static API with custom colors matching the design system
 */
export function StaticGoogleMap({
  address,
  width = 2560,
  height = 1440,
  zoom = 1,
  className = '',
  alt = 'Map location',
}: StaticGoogleMapProps) {
  const apiKey = env.googleMaps.apiKey;

  if (!apiKey) {
    console.warn(
      'Google Maps API key is not set. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.'
    );
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={{ width, height }}
      >
        <p className="text-sm text-gray-500">Map unavailable - API key not configured</p>
      </div>
    );
  }

  // Custom map styling to match the design system with better contrast
  // Google Static Maps API style format: feature:featureType|element:elementType|property:value
  // Show all streets, labels, and features - only hide business POIs
  const mapStyles = [
    'feature:all|element:geometry|color:0xe6e6e6', // Darker gray background
    'feature:water|element:geometry|color:0xf0c4d0', // Pink water/river
    'feature:water|element:labels.text.fill|color:0x3a3a3a', // Dark labels on water
    'feature:road.highway|element:geometry|color:0xc7017f', // Magenta highways - strong contrast
    'feature:road.highway|element:labels.text.fill|color:0xffffff', // White text on magenta highways
    'feature:road.highway|element:labels.text.stroke|color:0xc7017f', // Magenta stroke for highway labels
    'feature:road.arterial|element:geometry|color:0xf0c4d0', // Pink arterial roads
    'feature:road.arterial|element:labels.text.fill|color:0x3a3a3a', // Dark text on pink roads
    'feature:road.local|element:geometry|color:0xe6e0e0', // Pink-gray local roads - lighter
    'feature:road.local|element:labels.text.fill|color:0x3a3a3a', // Dark text on local roads
    'feature:road|element:labels.icon|visibility:off', // Hide road icons for cleaner look
    'feature:poi.business|element:all|visibility:off', // Hide only business POIs
    'feature:poi.attraction|element:all|visibility:off', // Hide attractions
    'feature:poi.school|element:all|visibility:off', // Hide schools
    'feature:poi.place_of_worship|element:all|visibility:off', // Hide places of worship
    'feature:landscape|element:geometry|color:0xe6e6e6', // Darker gray landscape
    'feature:landscape.natural|element:geometry|color:0xf5f5f5', // Slightly lighter for natural features
    'feature:administrative.locality|element:labels.text.fill|color:0x3a3a3a', // Dark labels for districts
    'feature:administrative.neighborhood|element:labels.text.fill|color:0x6b6b6b', // Medium gray for neighborhoods
    'feature:administrative|element:geometry.stroke|color:0xf0c4d0', // Pink borders
    'feature:administrative|element:labels.text.fill|color:0x3a3a3a', // Dark gray labels
    'feature:administrative|element:labels.text.stroke|color:0xffffff', // White stroke for better readability
  ];

  // Build style parameters - each style needs to be URL encoded separately
  const stylesParam = mapStyles.map((style) => `style=${encodeURIComponent(style)}`).join('&');

  // Build the static map URL with custom marker (magenta color #c7017f)
  // Use scale=2 for retina/high-DPI displays to reduce blurriness
  // Marker format: color:0xRRGGBB|label:LABEL|location
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
    address
  )}&zoom=${zoom}&size=${width}x${height}&scale=2&markers=color:0xc7017f|${encodeURIComponent(
    address
  )}&${stylesParam}&key=${apiKey}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={mapUrl}
        alt={alt}
        fill
        className="object-cover"
        sizes="100vw"
        unoptimized // Static maps are already optimized by Google
      />
    </div>
  );
}
