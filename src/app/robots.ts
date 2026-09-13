import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/*/admin/', '/*/admin/*'],
    },
    sitemap: 'https://www.salamconsultingedu.com/sitemap.xml',
  };
}
