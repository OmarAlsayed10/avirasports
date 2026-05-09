import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatEgp } from '@/lib/utils/format-egp';
import cloudinaryLoader from '@/lib/cloudinary-loader';
import DeleteProductButton from '@/components/admin/products/delete-product-button';
import ToggleStatusButton from '@/components/admin/products/toggle-status-button';
import type { Metadata } from 'next';
import { getT } from '@/lib/locale';

export const metadata: Metadata = { title: 'Products' };

interface Props {
  searchParams: { page?: string; q?: string; category?: string };
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const limit = 20;
  const q = searchParams.q ?? '';
  const categorySlug = searchParams.category ?? '';

  const where = {
    ...(q && {
      OR: [
        { name: { contains: q, mode: 'insensitive' as const } },
        { brand: { contains: q, mode: 'insensitive' as const } },
      ],
    }),
    ...(categorySlug && { category: { slug: categorySlug } }),
  };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true, nameAr: true } },
        images: { where: { isPrimary: true }, take: 1 },
        variants: { select: { stockCount: true } },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, slug: true, name: true, nameAr: true } }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const { locale, t } = getT();
  const isAr = locale === 'ar';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{t.admin.products}</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-primary-btn text-white text-sm font-semibold rounded-md hover:bg-primary-btn/90 transition-colors"
        >
          {t.admin.addProduct}
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" className="flex gap-3 mb-5 flex-wrap">
        <input
          name="q"
          defaultValue={q}
          placeholder={t.admin.searchProducts}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
        />
        <select
          name="category"
          defaultValue={categorySlug}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
        >
          <option value="">{t.admin.allCategories}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {isAr && cat.nameAr ? cat.nameAr : cat.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
        >
          {t.admin.filter}
        </button>
        {(q || categorySlug) && (
          <Link
            href="/admin/products"
            className="px-4 py-2 text-gray-500 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            {t.admin.clear}
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  {t.admin.product}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  {t.admin.category}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  {t.admin.price}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  {t.admin.stock}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  {t.admin.status}
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const totalStock = product.variants.reduce((s, v) => s + v.stockCount, 0);
                const primaryImage = product.images[0];
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {primaryImage ? (
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 shrink-0">
                            <img
                              src={cloudinaryLoader({ src: primaryImage.url, width: 80, quality: 80 })}
                              alt={primaryImage.alt}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-gray-100 shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {isAr && product.nameAr ? product.nameAr : product.name}
                          </p>
                          <p className="text-xs text-gray-400">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {isAr && product.category.nameAr ? product.category.nameAr : product.category.name}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatEgp(Number(product.basePriceEgp))}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          totalStock > 0 ? 'text-green-600 font-medium' : 'text-red-500 font-medium'
                        }
                      >
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ToggleStatusButton id={product.id} isActive={product.isActive} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 justify-end">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-xs text-primary-btn hover:underline font-medium"
                        >
                          {t.admin.edit}
                        </Link>
                        <DeleteProductButton id={product.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">{t.admin.noProductsFound}</div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              {t.admin.productsCount((page - 1) * limit + 1, Math.min(page * limit, total), total)}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/products?page=${page - 1}${q ? `&q=${q}` : ''}${categorySlug ? `&category=${categorySlug}` : ''}`}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {t.admin.previous}
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/products?page=${page + 1}${q ? `&q=${q}` : ''}${categorySlug ? `&category=${categorySlug}` : ''}`}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {t.admin.next}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
