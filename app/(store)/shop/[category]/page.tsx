import { permanentRedirect, notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

interface CategoryPageProps {
  params: { category: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const cat = await prisma.category.findUnique({ where: { slug: params.category }, select: { name: true } });
  if (!cat) return {};
  return {
    title: `${cat.name} — Shop Avira`,
    description: `Browse ${cat.name} gear from top brands in Egypt. Genuine products, free delivery.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const cat = await prisma.category.findUnique({ where: { slug: params.category }, select: { slug: true } });
  if (!cat) notFound();
  permanentRedirect(`/shop?category=${params.category}`);
}
