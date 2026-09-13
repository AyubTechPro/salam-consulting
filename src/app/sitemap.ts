import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.salamconsultingedu.com';
  
  // The core pages of the platform
  const routes = [
    '',
    '/study-abroad',
    '/contact',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate URLs for all supported languages
  routing.locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  return sitemapEntries;
}
