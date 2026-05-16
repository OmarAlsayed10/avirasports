'use client';

import { useState, useCallback } from 'react';
import { z } from 'zod';

const RECENT_KEY = 'avira-recent-searches';
const MAX_RECENT = 5;
const recentSchema = z.array(z.string());

function readFromStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
    return recentSchema.parse(raw);
  } catch {
    return [];
  }
}

function writeToStorage(searches: string[]) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(searches));
}

export function useRecentSearches() {
  const [recent, setRecent] = useState<string[]>([]);

  const load = useCallback(() => {
    setRecent(readFromStorage());
  }, []);

  const save = useCallback((query: string) => {
    const existing = readFromStorage().filter((q) => q !== query);
    const updated = [query, ...existing].slice(0, MAX_RECENT);
    writeToStorage(updated);
  }, []);

  const remove = useCallback((query: string) => {
    const updated = readFromStorage().filter((q) => q !== query);
    writeToStorage(updated);
    setRecent(updated);
  }, []);

  return { recent, load, save, remove };
}
