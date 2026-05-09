import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXTAUTH_URL ?? 'https://avira.eg';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account/', '/checkout/', '/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
