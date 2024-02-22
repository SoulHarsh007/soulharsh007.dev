import {MetadataRoute} from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: 'daily',
      lastModified: new Date(),
      priority: 1,
      url: 'https://soulharsh007.dev',
    },
  ];
}
