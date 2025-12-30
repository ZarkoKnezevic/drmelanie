'use client';

import { useEffect, useRef } from 'react';
import { env } from '@/utils';

// Google Maps API type definitions
interface GoogleMapsAPI {
  maps: {
    Map: new (element: HTMLElement | null, options?: Record<string, unknown>) => unknown;
    Geocoder: new () => {
      geocode: (
        request: { address: string },
        callback: (
          results: Array<{ geometry: { location: { lat: () => number; lng: () => number } } }>,
          status: string
        ) => void
      ) => void;
    };
    InfoWindow: new (options?: { content?: string }) => {
      open: (map: unknown, marker: unknown) => void;
      close: () => void;
      addListener: (event: string, callback: () => void) => void;
    };
    Marker: new (options?: {
      position?: { lat: () => number; lng: () => number };
      map?: unknown;
      title?: string;
      icon?: { url: string; scaledSize?: unknown; anchor?: unknown };
    }) => {
      addListener: (event: string, callback: () => void) => void;
    };
    Size: new (width: number, height: number) => unknown;
    Point: new (x: number, y: number) => unknown;
    ControlPosition: {
      readonly RIGHT_CENTER: number;
      readonly TOP_RIGHT: number;
      readonly RIGHT_TOP: number;
      readonly LEFT_TOP: number;
    };
    MapTypeControlStyle: {
      readonly HORIZONTAL_BAR: number;
    };
    MapTypeId: {
      readonly ROADMAP: string;
      readonly SATELLITE: string;
    };
  };
}

interface GoogleMapsWindow extends Window {
  google?: GoogleMapsAPI;
}

interface InteractiveGoogleMapProps {
  address: string;
  name?: string;
  practice?: string;
  addressLine?: string;
  postalCode?: number | string;
  city?: string;
  email?: string;
  phone?: string;
  className?: string;
  height?: string;
}

/**
 * Interactive Google Map with custom info card
 * Uses Google Maps Embed API for better quality and interactivity
 */
export function InteractiveGoogleMap({
  address,
  name,
  practice,
  addressLine,
  postalCode,
  city,
  email,
  phone,
  className = '',
  height = '500px',
}: InteractiveGoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // Check API key - NEXT_PUBLIC_ variables are embedded at build time
  // For Vercel: Make sure to add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in Environment Variables
  // and redeploy after adding it
  const apiKey =
    (typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY : '') ||
    env.googleMaps.apiKey;

  useEffect(() => {
    if (typeof window === 'undefined' || !apiKey || !mapRef.current) return;

    const initializeMap = () => {
      const googleWindow = window as GoogleMapsWindow;
      if (!mapRef.current || !googleWindow.google?.maps || typeof window === 'undefined') return;

      const googleMaps = googleWindow.google.maps;
      
      // Check if Geocoder is available
      if (!googleMaps.Geocoder) {
        console.warn('Google Maps Geocoder is not available yet. Retrying...');
        // Retry after a short delay
        setTimeout(() => initializeMap(), 100);
        return;
      }
      
      const geocoder = new googleMaps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0] && mapRef.current) {
          const map = new googleMaps.Map(mapRef.current, {
            center: results[0].geometry.location,
            zoom: 15,
            styles: [
              {
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ color: '#e6e6e6' }], // Darker gray background
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#f0c4d0' }], // Pink water
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{ color: '#c7017f' }], // Magenta highways
              },
              {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [{ color: '#f0c4d0' }], // Pink arterial roads
              },
              {
                featureType: 'road.local',
                elementType: 'geometry',
                stylers: [{ color: '#e6e0e0' }], // Pink-gray local roads
              },
              {
                featureType: 'poi',
                elementType: 'all',
                stylers: [{ visibility: 'off' }], // Hide all POIs/landmarks
              },
            ],
            // Enable ALL controls
            disableDefaultUI: false,
            zoomControl: true,
            zoomControlOptions: {
              position: googleMaps.ControlPosition.RIGHT_CENTER,
            },
            mapTypeControl: true,
            mapTypeControlOptions: {
              style: googleMaps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: googleMaps.ControlPosition.TOP_RIGHT,
              mapTypeIds: [googleMaps.MapTypeId.ROADMAP, googleMaps.MapTypeId.SATELLITE],
            },
            streetViewControl: true,
            streetViewControlOptions: {
              position: googleMaps.ControlPosition.RIGHT_TOP,
            },
            fullscreenControl: true,
            fullscreenControlOptions: {
              position: googleMaps.ControlPosition.RIGHT_TOP,
            },
            rotateControl: true,
            rotateControlOptions: {
              position: googleMaps.ControlPosition.LEFT_TOP,
            },
            scaleControl: true,
            gestureHandling: 'cooperative', // Require Ctrl/Cmd to zoom with scroll
          });

          // Build address string
          const addressParts = [];
          if (addressLine) addressParts.push(addressLine);
          if (postalCode && city) {
            addressParts.push(`${postalCode} ${city}`);
          } else if (postalCode) {
            addressParts.push(String(postalCode));
          } else if (city) {
            addressParts.push(city);
          }
          const fullAddress = addressParts.join(', ');

          // Get email display text
          let emailDisplay = '';
          if (email) {
            emailDisplay = typeof email === 'string' ? email.replace('mailto:', '') : email;
          }

          // Create custom info window content with logo and footer data
          const infoContent = `
            <div style="padding: 8px 12px; font-family: 'Montserrat', sans-serif; max-width: 300px; min-width: 250px; box-sizing: border-box; position: relative;">
              <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 6px;">
                <img src="/logo.png" alt="Logo" style="max-width: 100px; max-height: 100px; width: auto; height: auto; object-fit: contain;" />
              </div>
              ${name ? `<h3 style="margin: 0 0 2px 0; font-size: 18px; font-weight: 600; color: #3a3a3a; text-align: left; line-height: 1.2;">${name}</h3>` : ''}
              ${practice ? `<p style="margin: 0 0 6px 0; font-size: 14px; color: #3a3a3a; text-align: left; line-height: 1.2;">${practice}</p>` : ''}
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e6e0e0;">
                ${fullAddress ? `<p style="margin: 0 0 3px 0; font-size: 14px; color: #3a3a3a; text-align: left; line-height: 1.3;">${fullAddress}</p>` : ''}
                ${emailDisplay ? `<p style="margin: 0 0 3px 0; font-size: 14px; color: #3a3a3a; text-align: left; line-height: 1.3;">${emailDisplay}</p>` : ''}
                ${phone ? `<p style="margin: 0; font-size: 14px; color: #3a3a3a; text-align: left; line-height: 1.3;">Tel.: ${phone}</p>` : ''}
              </div>
            </div>
          `;

          const infoWindow = new googleMaps.InfoWindow({
            content: infoContent,
          });

          // Customize the close button position after the info window is created
          // Note: Google Maps InfoWindow close button is controlled by the API
          // We can add custom CSS to position it at top-right and remove focus outline
          infoWindow.addListener('domready', () => {
            // Try multiple selectors to find the close button
            const selectors = [
              'button[aria-label*="Close"]',
              'button[title*="Close"]',
              '.gm-ui-hover-effect',
              'button[aria-label*="Schließen"]',
            ];

            for (const selector of selectors) {
              const closeButton = document.querySelector(selector);
              if (closeButton) {
                (closeButton as HTMLElement).style.cssText =
                  'position: absolute !important; top: 4px !important; right: 4px !important; left: auto !important; z-index: 1000 !important; outline: none !important; box-shadow: none !important;';
                // Also remove focus on the button element itself
                (closeButton as HTMLElement).blur();
                break;
              }
            }
          });

          // Create custom marker with custom icon
          const markerTitle = name || practice || address;
          const marker = new googleMaps.Marker({
            position: results[0].geometry.location,
            map: map,
            title: markerTitle,
            icon: {
              url: '/icons/favicons/icon1.png',
              scaledSize: new googleMaps.Size(32, 32), // Smaller marker size
              anchor: new googleMaps.Point(16, 32), // Anchor point (center bottom)
            },
          });

          // Open info window on marker click
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          // Info window is NOT opened by default - user must click the marker
        }
      });
    };

    // Check if Google Maps is already loaded
    const googleWindow = window as GoogleMapsWindow;
    if (googleWindow.google?.maps) {
      initializeMap();
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Wait a bit for the API to fully initialize with loading=async
      setTimeout(() => {
        initializeMap();
      }, 100);
    };

    script.onerror = () => {
      console.error('Failed to load Google Maps script');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [address, name, practice, addressLine, postalCode, city, email, phone, apiKey]);

  if (!apiKey) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gray-100 ${className}`}
        style={{ height }}
      >
        <p className="text-sm font-medium text-gray-700">
          Map unavailable - API key not configured
        </p>
        <p className="px-4 text-center text-xs text-gray-500">
          Please add{' '}
          <code className="rounded bg-gray-200 px-1">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your{' '}
          <code className="rounded bg-gray-200 px-1">.env.local</code> file and restart the dev
          server.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className={`w-full ${className}`}
      style={{
        height: height === '100%' ? '100%' : height,
        minHeight: '500px',
      }}
    />
  );
}
