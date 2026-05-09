'use client';

import { useEffect, useRef, useState } from 'react';
import { useDebounce } from './use-debounce';
import { useQueryParams } from './use-query-params';

export function useDebouncedParam(key: string, delay = 500) {
  const { getParam, setParam } = useQueryParams();
  const urlValue = getParam(key) ?? '';

  const [localValue, setLocalValue] = useState(urlValue);
  const debouncedValue = useDebounce(localValue, delay);
  const lastPushedRef = useRef(urlValue);

  useEffect(() => {
    if (urlValue !== lastPushedRef.current) {
      setLocalValue(urlValue);
      lastPushedRef.current = urlValue;
    }
  }, [urlValue]);

  useEffect(() => {
    if (debouncedValue !== lastPushedRef.current) {
      lastPushedRef.current = debouncedValue;
      setParam(key, debouncedValue || null);
    }
  }, [debouncedValue, key, setParam]);

  return [localValue, setLocalValue] as const;
}
