'use client';

import { useQueryParams } from '@/lib/hooks/use-query-params';
import { useDebouncedParam } from '@/lib/hooks/use-debounced-param';
import { useLocale } from '@/lib/i18n/context';

const RATINGS = [4, 3, 2, 1];

type Category = { slug: string; name: string; nameAr?: string | null };

interface FilterSidebarProps {
  categories: Category[];
  brands: string[];
}

export function FilterSidebar({ categories, brands }: FilterSidebarProps) {
  const { getParam, setParam, setParams, isPending } = useQueryParams();
  const { t } = useLocale();

  const activeCategory = getParam('category') ?? '';
  const activeBrand = getParam('brand') ?? '';
  const activeRating = getParam('rating') ?? '';
  const [priceMin, setPriceMin] = useDebouncedParam('priceMin');
  const [priceMax, setPriceMax] = useDebouncedParam('priceMax');
  const inStockOnly = getParam('inStockOnly') === 'true';

  return (
    <aside
      className={`space-y-6 transition-opacity ${isPending ? 'opacity-50 pointer-events-none' : ''}`}
      aria-label="Product filters"
      aria-busy={isPending}
    >
      {/* Category */}
      <div>
        <h3 className="text-nav-sm font-semibold text-text-primary dark:text-text-on-dark mb-3">{t.shop.category}</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              value=""
              checked={activeCategory === ''}
              onChange={() => setParam('category', null)}
              className="accent-primary"
            />
            <span className="text-nav-sm text-text-primary dark:text-text-on-dark">{t.shop.allCategories}</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={cat.slug}
                checked={activeCategory === cat.slug}
                onChange={() => setParam('category', cat.slug)}
                className="accent-primary"
              />
              <span className="text-nav-sm text-text-primary dark:text-text-on-dark">
                  {t.dir === 'rtl' && cat.nameAr ? cat.nameAr : cat.name}
                </span>
            </label>
          ))}
        </div>
      </div>

      {brands.length > 0 && (
        <>
          <hr className="border-border-primary/20 dark:border-white/10" />

          {/* Brand */}
          <div>
            <h3 className="text-nav-sm font-semibold text-text-primary dark:text-text-on-dark mb-3">{t.shop.brand}</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeBrand === brand}
                    onChange={(e) => setParam('brand', e.target.checked ? brand : null)}
                    className="accent-primary rounded"
                  />
                  <span className="text-nav-sm text-text-primary dark:text-text-on-dark">{brand}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <hr className="border-border-primary/20 dark:border-white/10" />

      {/* Price Range */}
      <div>
        <h3 className="text-nav-sm font-semibold text-text-primary dark:text-text-on-dark mb-3">{t.shop.price}</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder={t.shop.minPrice}
            value={priceMin}
            min={0}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full h-9 px-3 border border-border-primary/40 dark:border-white/20 rounded-btn-sm text-nav-sm text-text-primary dark:text-text-on-dark bg-bg-white dark:bg-bg-surface focus:outline-none focus:border-primary"
          />
          <span className="text-text-secondary dark:text-text-footer-link">–</span>
          <input
            type="number"
            placeholder={t.shop.maxPrice}
            value={priceMax}
            min={0}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full h-9 px-3 border border-border-primary/40 dark:border-white/20 rounded-btn-sm text-nav-sm text-text-primary dark:text-text-on-dark bg-bg-white dark:bg-bg-surface focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <hr className="border-border-primary/20 dark:border-white/10" />

      {/* Rating */}
      <div>
        <h3 className="text-nav-sm font-semibold text-text-primary dark:text-text-on-dark mb-3">{t.shop.rating}</h3>
        <div className="space-y-2">
          {RATINGS.map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={String(r)}
                checked={activeRating === String(r)}
                onChange={() => setParam('rating', activeRating === String(r) ? null : String(r))}
                className="accent-primary"
              />
              <span className="text-nav-sm text-text-primary dark:text-text-on-dark">{'★'.repeat(r)} {t.shop.andUp}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-border-primary/20 dark:border-white/10" />

      {/* Availability */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setParam('inStockOnly', e.target.checked ? 'true' : null)}
            className="accent-primary rounded"
          />
          <span className="text-nav-sm font-medium text-text-primary dark:text-text-on-dark">{t.shop.inStockOnly}</span>
        </label>
      </div>
    </aside>
  );
}
