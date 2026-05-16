import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/infrastructure/db/prisma";
import { ProductCard } from "@/modules/product/components/product-card";
import { getT } from "@/modules/_shared/i18n/locale";
import { homeTokens } from "../home.tokens";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    take: 12,
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { sortOrder: "asc" as const }, take: 1 },
      variants: { select: { stockCount: true } },
      category: { select: { slug: true, name: true, nameAr: true } },
    },
  });
}

type FeaturedProduct = Awaited<ReturnType<typeof getFeaturedProducts>>[number];

export async function FeaturedProducts() {
  const { locale, t } = getT();
  const products = await getFeaturedProducts();

  if (products.length === 0) return null;

  return (
    <section className={homeTokens.section.base} aria-label="Featured products">
      <div className={homeTokens.section.inner}>
        <div className={homeTokens.section.header}>
          <h2 className={homeTokens.section.heading}>{t.admin.typeFeatured}</h2>
          <Link href="/shop?sort=featured" className={homeTokens.section.viewAllLink}>
            {t.home.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className={homeTokens.section.grid4}>
          {products.map((product: FeaturedProduct, index: number) => (
            <ProductCard
              key={product.id}
              priority={index === 0}
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                nameAr: product.nameAr ?? undefined,
                brand: product.brand,
                basePriceEgp: Number(product.basePriceEgp),
                discountPercent: product.discountPercent ? Number(product.discountPercent) : null,
                ratingAvg: Number(product.ratingAvg),
                reviewCount: product.reviewCount,
                images: product.images.map((img) => ({
                  url: img.url,
                  alt: img.alt ?? product.name,
                })),
                variants: product.variants,
                category: product.category ?? undefined,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
