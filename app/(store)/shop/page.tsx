import { Suspense } from 'react';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { productFiltersSchema } from '@/modules/product/product.validators';
import { listProducts } from '@/modules/product/product.queries';
import { prisma } from '@/infrastructure/db/prisma';
import { ProductGrid, ProductGridSkeleton } from '@/modules/product/components/product-grid';
import { FilterSidebar } from '@/modules/shop/components/filter-sidebar';
import { FilterDrawer } from '@/modules/shop/components/filter-drawer';
import { FilterChips } from '@/modules/shop/components/filter-chips';
import { SortDropdown } from '@/modules/shop/components/sort-dropdown';
import { ResultsCount } from '@/modules/shop/components/results-count';
import { ResultsPending } from '@/modules/shop/components/results-pending';
import { Pagination } from '@/modules/shop/components/pagination';
import { NoResults } from '@/modules/shop/components/no-results';
import { Breadcrumb } from '@/modules/_shared/ui/breadcrumb';
import { getT } from '@/modules/_shared/i18n/locale';

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
