import {MetadataRoute} from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: '#fff',
    description: 'List of infrastructure and services hosted by SoulHarsh007',
    display: 'standalone',
    icons: [
      {
        sizes: 'any',
        src: '/favicon.ico',
        type: 'image/x-icon',
      },
      {
        sizes: 'any',
        src: '/android-icon.png',
        type: 'image/png',
      },
      {
        sizes: 'any',
        src: '/apple-icon.png',
        type: 'image/png',
      },
    ],
    name: 'SoulHarsh007 - Infrastructure and Services',
    short_name: 'SoulHarsh007 - Services',
    start_url: '/',
    theme_color: '#fff',
  };
}
