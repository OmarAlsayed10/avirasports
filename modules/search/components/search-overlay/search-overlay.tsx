'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { X, Search, Clock } from 'lucide-react';
import { useUIStore } from '@/modules/_shared/stores/ui.store';
import { useDebounce } from '@/modules/_shared/hooks/use-debounce';
import { searchProducts } from '@/modules/search/search.service';
import { ProductResultItem, CategoryResultItem } from '../search-result-item';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { useRecentSearches } from '../../hooks/use-recent-searches';
import { useSearchKeyboardShortcuts } from '../../hooks/use-search-keyboard-shortcuts';
import { searchOverlayTokens as tk } from './search-overlay.tokens';

type SearchResults = Awaited<ReturnType<typeof searchProducts>>;

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUIStore();
  const { t } = useLocale();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { recent, load: loadRecent, save: saveRecent, remove: removeRecent } = useRecentSearches();

  const debouncedQuery = useDebounce(query, 300);

  useSearchKeyboardShortcuts({
    open: searchOpen,
    onToggle: () => setSearchOpen(!searchOpen),
    onClose: () => setSearchOpen(false),
  });

  useEffect(() => {
    if (searchOpen) {
      loadRecent();
      setQuery('');
      setResults(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen, loadRecent]);

  useEffect(() => {
    document.body.style.overflow = searchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [searchOpen]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(null);
      return;
    }
    startTransition(async () => {
      const data = await searchProducts(debouncedQuery);
      setResults(data);
    });
  }, [debouncedQuery]);

  const handleSelect = (name: string) => {
    saveRecent(name);
    setSearchOpen(false);
  };

  const handleRemoveRecent = (q: string) => {
    removeRecent(q);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveRecent(query.trim());
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

  if (!searchOpen) return null;

  const hasResults = results && (results.products.length > 0 || results.categories.length > 0);
  const noResults = results && results.products.length === 0 && results.categories.length === 0;
  const showRecent = !query.trim() && recent.length > 0;

  return (
    <div
      className={tk.backdrop}
      onClick={() => setSearchOpen(false)}
      aria-modal="true"
      role="dialog"
      aria-label="Search products"
    >
      <div className={tk.panel} onClick={(e) => e.stopPropagation()}>
        <div className={tk.inner}>
          <form onSubmit={handleSubmit} className={tk.searchBar}>
            <Search className="w-5 h-5 text-text-secondary flex-shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search.placeholder}
              className={tk.input}
              aria-label="Search"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setResults(null); }}
                className={tk.iconBtn}
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className={tk.iconBtn}
              aria-label="Close search"
            >
              <span className="text-xs border border-border-primary/30 rounded px-1.5 py-0.5">ESC</span>
            </button>
          </form>
        </div>

        <div className={tk.results}>
          {isPending && (
            <p className={tk.statusText}>Searching…</p>
          )}

          {!isPending && noResults && (
            <p className={tk.statusText}>
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {!isPending && hasResults && (
            <>
              {results.categories.length > 0 && (
                <div className="mt-3">
                  <p className={tk.sectionLabel}>Categories</p>
                  {results.categories.map((cat) => (
                    <CategoryResultItem key={cat.id} item={cat} onSelect={handleSelect} />
                  ))}
                </div>
              )}
              {results.products.length > 0 && (
                <div className="mt-3">
                  <p className={tk.sectionLabel}>Products</p>
                  {results.products.map((p) => (
                    <ProductResultItem key={p.id} item={p} onSelect={handleSelect} />
                  ))}
                </div>
              )}
            </>
          )}

          {showRecent && !isPending && !results && (
            <div className="mt-3">
              <p className={tk.sectionLabel}>Recent Searches</p>
              {recent.map((q) => (
                <div key={q} className={tk.recentItem}>
                  <Clock className="w-4 h-4 text-text-secondary flex-shrink-0" aria-hidden="true" />
                  <button className={tk.recentText} onClick={() => setQuery(q)}>
                    {q}
                  </button>
                  <button
                    onClick={() => handleRemoveRecent(q)}
                    className={tk.recentRemoveBtn}
                    aria-label={`Remove "${q}" from recent searches`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
