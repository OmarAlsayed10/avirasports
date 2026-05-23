'use client';

import { useQueryParams } from '@/modules/_shared/hooks/use-query-params';
import { useDebouncedParam } from '@/modules/_shared/hooks/use-debounced-param';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { cn } from '@/modules/_shared/utils/cn';
import { filterSidebarTokens } from './filter-sidebar.tokens';
import type { FilterSidebarProps } from './filter-sidebar.types';

const RATINGS = [4, 3, 2, 1];

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
      className={cn(filterSidebarTokens.root, isPending ? 'opacity-50 pointer-events-none' : '')}
      aria-label="Product filters"
      aria-busy={isPending}
    >
      <div>
        <h3 className={filterSidebarTokens.sectionTitle}>{t.shop.category}</h3>
        <div className="space-y-2">
          <label className={filterSidebarTokens.radioLabel}>
            <input
              type="radio"
              name="category"
              value=""
              checked={activeCategory === ''}
              onChange={() => setParam('category', null)}
              className="accent-primary"
            />
            <span className={filterSidebarTokens.radioText}>{t.shop.allCategories}</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.slug} className={filterSidebarTokens.radioLabel}>
              <input
                type="radio"
                name="category"
                value={cat.slug}
                checked={activeCategory === cat.slug}
                onChange={() => setParam('category', cat.slug)}
                className="accent-primary"
              />
              <span className={filterSidebarTokens.radioText}>
                {t.dir === 'rtl' && cat.nameAr ? cat.nameAr : cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {brands.length > 0 && (
        <>
          <hr className={filterSidebarTokens.divider} />

          <div>
            <h3 className={filterSidebarTokens.sectionTitle}>{t.shop.brand}</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand} className={filterSidebarTokens.radioLabel}>
                  <input
                    type="checkbox"
                    checked={activeBrand === brand}
                    onChange={(e) => setParam('brand', e.target.checked ? brand : null)}
                    className="accent-primary rounded"
                  />
                  <span className={filterSidebarTokens.radioText}>{brand}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <hr className={filterSidebarTokens.divider} />

      <div>
        <h3 className={filterSidebarTokens.sectionTitle}>{t.shop.price}</h3>
        <div className={filterSidebarTokens.priceRow}>
          <input
            type="number"
            placeholder={t.shop.minPrice}
            value={priceMin}
            min={0}
            onChange={(e) => setPriceMin(e.target.value)}
            className={filterSidebarTokens.priceInput}
          />
          <span className="text-text-secondary dark:text-text-footer-link">–</span>
          <input
            type="number"
            placeholder={t.shop.maxPrice}
            value={priceMax}
            min={0}
            onChange={(e) => setPriceMax(e.target.value)}
            className={filterSidebarTokens.priceInput}
          />
        </div>
      </div>

      <hr className={filterSidebarTokens.divider} />

      <div>
        <h3 className={filterSidebarTokens.sectionTitle}>{t.shop.rating}</h3>
        <div className="space-y-2">
          {RATINGS.map((r) => (
            <label key={r} className={filterSidebarTokens.radioLabel}>
              <input
                type="radio"
                name="rating"
                value={String(r)}
                checked={activeRating === String(r)}
                onChange={() => setParam('rating', activeRating === String(r) ? null : String(r))}
                className="accent-primary"
              />
              <span className={filterSidebarTokens.radioText}>{'★'.repeat(r)} {t.shop.andUp}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className={filterSidebarTokens.divider} />

      <div>
        <label className={filterSidebarTokens.radioLabel}>
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
