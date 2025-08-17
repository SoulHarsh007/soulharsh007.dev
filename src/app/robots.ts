import {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: '/',
      userAgent: '*',
    },
    sitemap: 'https://soulharsh007.dev/sitemap.xml',
  };
}
