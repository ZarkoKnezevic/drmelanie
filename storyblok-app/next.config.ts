import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
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
    qualities: [100, 75],
  },
  // Enable React strict mode
  reactStrictMode: true,
  // Ensure CSS is properly processed in production
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
};

export default nextConfig;
