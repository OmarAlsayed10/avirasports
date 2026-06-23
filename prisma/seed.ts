import { PrismaClient } from '@prisma/client';
import { slugify } from '../modules/_shared/utils/slugify';

const prisma = new PrismaClient();

const CATEGORIES: { name: string; sortOrder: number }[] = [];

const SAMPLE_PRODUCTS: {
  name: string;
  brand: string;
  category: string;
  basePriceEgp: number;
  discountPercent: number | null;
  isFeatured: boolean;
  description: string;
  specs: Record<string, string>;
  sku: string;
  stock: number;
}[] = [];

const COUPONS: {
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
  minOrderEgp: number | null;
  maxRedemptions: number | null;
  validFrom: Date;
  validUntil: Date;
}[] = [];

async function main() {
  // Seed categories
  const categoryMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: slugify(cat.name) },
      update: {},
      create: { slug: slugify(cat.name), name: cat.name, sortOrder: cat.sortOrder },
    });
    categoryMap[cat.name] = created.id;
  }

  // Seed products
  for (const p of SAMPLE_PRODUCTS) {
    const categoryId = categoryMap[p.category];
    if (!categoryId) continue;

    const product = await prisma.product.upsert({
      where: { slug: slugify(p.name) },
      update: {},
      create: {
        slug: slugify(p.name),
        name: p.name,
        brand: p.brand,
        description: p.description,
        specs: p.specs,
        categoryId,
        basePriceEgp: p.basePriceEgp,
        discountPercent: p.discountPercent,
        isFeatured: p.isFeatured,
        images: {
          create: {
            url: `products/${slugify(p.name)}-main.jpg`,
            alt: `${p.name} product image`,
            isPrimary: true,
            sortOrder: 0,
          },
        },
        variants: {
          create: {
            sku: p.sku,
            attributes: { color: (p.specs as { color: string }).color },
            stockCount: p.stock,
          },
        },
      },
    });
    void product;
  }

  // Seed coupons
  for (const coupon of COUPONS) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon,
    });
  }
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
