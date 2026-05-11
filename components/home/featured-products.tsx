import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/product-card";
import { getT } from "@/lib/locale";

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
    <section className="py-12 bg-bg-page" aria-label="Featured products">
      <div className="max-w-content mx-auto px-site">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
            {t.admin.typeFeatured}
          </h2>
          <Link
            href="/shop?sort=featured"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-btn hover:underline"
          >
            {t.home.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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