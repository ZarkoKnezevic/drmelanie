'use client';

import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

interface LottieAnimationProps {
  src: string;
  className?: string;
}

export function LottieAnimation({ src, className = '' }: LottieAnimationProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    // Handle both absolute URLs and relative paths
    const url = src.startsWith('http') ? src : src.startsWith('/') ? src : `/${src}`;
    
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load: ${res.statusText}`);
        }
        const contentType = res.headers.get('content-type');
        // Check if response is actually JSON
        if (contentType && !contentType.includes('application/json') && !contentType.includes('text/plain')) {
          throw new Error('File is not JSON format. Please download the JSON version from LottieFiles.');
        }
        return res.json();
      })
      .then((data) => setAnimationData(data))
      .catch((err) => {
        console.error('Error loading Lottie animation:', err);
        console.error('URL attempted:', url);
        console.error('Make sure you downloaded the JSON version, not the .lottie file');
      });
  }, [src]);

  if (!animationData) return null;

  return <Lottie animationData={animationData} loop autoplay className={className} />;
}
