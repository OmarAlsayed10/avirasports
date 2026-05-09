import { Suspense } from 'react';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { productFiltersSchema } from '@/lib/validators/product';
import { listProducts } from '@/lib/queries/products';
import { prisma } from '@/lib/prisma';
import { ProductGrid, ProductGridSkeleton } from '@/components/product/product-grid';
import { FilterSidebar } from '@/components/shop/filter-sidebar';
import { FilterDrawer } from '@/components/shop/filter-drawer';
import { FilterChips } from '@/components/shop/filter-chips';
import { SortDropdown } from '@/components/shop/sort-dropdown';
import { ResultsCount } from '@/components/shop/results-count';
import { ResultsPending } from '@/components/shop/results-pending';
import { Pagination } from '@/components/shop/pagination';
import { NoResults } from '@/components/shop/no-results';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { getT } from '@/lib/locale';

export const metadata: Metadata = {
  title: 'Shop Sports Gear',
  description: 'Browse running, training, cycling, swimming, yoga, and football gear — all genuine products with free delivery in Egypt.',
};

interface ShopPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

async function ProductResults({ searchParams }: ShopPageProps) {
  const rawParams = Object.fromEntries(
    Object.entries(searchParams).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
  );

  const filters = productFiltersSchema.parse(rawParams);
  const { products, total, page, limit } = await listProducts(filters);

  if (products.length === 0) {
    return <NoResults />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ResultsCount shown={products.length} total={total} />
      </div>
      <ProductGrid products={products as Parameters<typeof ProductGrid>[0]['products']} />
      <Pagination total={total} page={page} limit={limit} />
    </div>
  );
}

const getFilterData = unstable_cache(
  async () => {
    const [categories, brandRows] = await Promise.all([
      prisma.category.findMany({ orderBy: { sortOrder: 'asc' }, select: { slug: true, name: true, nameAr: true } }),
      prisma.product.findMany({ where: { isActive: true }, select: { brand: true }, distinct: ['brand'], orderBy: { brand: 'asc' } }),
    ]);
    return { categories, brands: brandRows.map((r) => r.brand) };
  },
  ['shop-filter-data'],
  { revalidate: 300, tags: ['products', 'categories'] },
);

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { categories, brands } = await getFilterData().catch(() => ({ categories: [], brands: [] }));
  const { t } = getT();

  return (
    <div className="max-w-content mx-auto px-site py-8">
      <Breadcrumb
        items={[{ label: t.shop.breadcrumb }]}
      />

      <h1 className="font-secondary text-section-heading font-black uppercase tracking-tight text-text-primary dark:text-text-on-dark mt-4 mb-6">
        {t.shop.title}
      </h1>

      <Suspense>
        <FilterChips />
      </Suspense>

      <div className="flex flex-col gap-3 mt-4 mb-6 md:hidden">
        <Suspense>
          <FilterDrawer categories={categories} brands={brands} />
        </Suspense>
        <Suspense>
          <SortDropdown />
        </Suspense>
      </div>

      <div className="flex gap-8 mt-4">
        <div className="hidden md:block w-sidebar flex-shrink-0">
          <Suspense>
            <FilterSidebar categories={categories} brands={brands} />
          </Suspense>
        </div>

        <div className="flex-1 min-w-0">
          <div className="hidden md:flex items-center justify-end mb-6">
            <Suspense>
              <SortDropdown />
            </Suspense>
          </div>

          <div className="relative">
            <Suspense>
              <ResultsPending />
            </Suspense>
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductResults searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
