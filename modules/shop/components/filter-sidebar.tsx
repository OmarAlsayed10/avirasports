'use client';

import { useQueryParams } from '@/modules/_shared/hooks/use-query-params';
import { useDebouncedParam } from '@/modules/_shared/hooks/use-debounced-param';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { cn } from '@/modules/_shared/utils/cn';
import { shopTokens } from '../shop.tokens';

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
      className={cn(shopTokens.filterSidebar.root, isPending ? 'opacity-50 pointer-events-none' : '')}
      aria-label="Product filters"
      aria-busy={isPending}
    >
      <div>
        <h3 className={shopTokens.filterSidebar.sectionTitle}>{t.shop.category}</h3>
        <div className="space-y-2">
          <label className={shopTokens.filterSidebar.radioLabel}>
            <input
              type="radio"
              name="category"
              value=""
              checked={activeCategory === ''}
              onChange={() => setParam('category', null)}
              className="accent-primary"
            />
            <span className={shopTokens.filterSidebar.radioText}>{t.shop.allCategories}</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.slug} className={shopTokens.filterSidebar.radioLabel}>
              <input
                type="radio"
                name="category"
                value={cat.slug}
                checked={activeCategory === cat.slug}
                onChange={() => setParam('category', cat.slug)}
                className="accent-primary"
              />
              <span className={shopTokens.filterSidebar.radioText}>
                {t.dir === 'rtl' && cat.nameAr ? cat.nameAr : cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {brands.length > 0 && (
        <>
          <hr className={shopTokens.filterSidebar.divider} />

          <div>
            <h3 className={shopTokens.filterSidebar.sectionTitle}>{t.shop.brand}</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand} className={shopTokens.filterSidebar.radioLabel}>
                  <input
                    type="checkbox"
                    checked={activeBrand === brand}
                    onChange={(e) => setParam('brand', e.target.checked ? brand : null)}
                    className="accent-primary rounded"
                  />
                  <span className={shopTokens.filterSidebar.radioText}>{brand}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <hr className={shopTokens.filterSidebar.divider} />

      <div>
        <h3 className={shopTokens.filterSidebar.sectionTitle}>{t.shop.price}</h3>
        <div className={shopTokens.filterSidebar.priceRow}>
          <input
            type="number"
            placeholder={t.shop.minPrice}
            value={priceMin}
            min={0}
            onChange={(e) => setPriceMin(e.target.value)}
            className={shopTokens.filterSidebar.priceInput}
          />
          <span className="text-text-secondary dark:text-text-footer-link">–</span>
          <input
            type="number"
            placeholder={t.shop.maxPrice}
            value={priceMax}
            min={0}
            onChange={(e) => setPriceMax(e.target.value)}
            className={shopTokens.filterSidebar.priceInput}
          />
        </div>
      </div>

      <hr className={shopTokens.filterSidebar.divider} />

      <div>
        <h3 className={shopTokens.filterSidebar.sectionTitle}>{t.shop.rating}</h3>
        <div className="space-y-2">
          {RATINGS.map((r) => (
            <label key={r} className={shopTokens.filterSidebar.radioLabel}>
              <input
                type="radio"
                name="rating"
                value={String(r)}
                checked={activeRating === String(r)}
                onChange={() => setParam('rating', activeRating === String(r) ? null : String(r))}
                className="accent-primary"
              />
              <span className={shopTokens.filterSidebar.radioText}>{'★'.repeat(r)} {t.shop.andUp}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className={shopTokens.filterSidebar.divider} />

      <div>
        <label className={shopTokens.filterSidebar.radioLabel}>
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
