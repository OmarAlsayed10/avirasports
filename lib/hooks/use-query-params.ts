'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useTransition } from 'react';

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      if (key !== 'page') params.delete('page');
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  const setParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      let hasNonPageChange = false;
      for (const [key, value] of Object.entries(updates)) {
        if (key !== 'page') hasNonPageChange = true;
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      if (hasNonPageChange) params.delete('page');
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  const clearParams = useCallback(
    (keys: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const key of keys) params.delete(key);
      params.delete('page');
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  const getParam = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams]
  );

  return { setParam, setParams, clearParams, getParam, searchParams, isPending };
}
