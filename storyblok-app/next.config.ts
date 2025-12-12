import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Uncomment the line below to enable static export for world4you
  // output: 'export',
  images: {
    // Uncomment the line below if using static export
    // unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a.storyblok.com',
      },
      {
        protocol: 'https',
        hostname: '**.storyblok.com',
      },
    ],
    qualities: [100, 90, 75],
  },
  // Enable React strict mode
  reactStrictMode: true,
  // Ensure CSS is properly processed in production
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
};

export default nextConfig;
