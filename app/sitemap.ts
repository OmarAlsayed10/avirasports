import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL ?? 'https://avira.eg';

  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${base}/shop?category=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
