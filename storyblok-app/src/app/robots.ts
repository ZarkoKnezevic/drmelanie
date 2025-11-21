import { MetadataRoute } from 'next';
import { env } from '@/utils';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${env.app.domain}/sitemap.xml`,
  };
}

