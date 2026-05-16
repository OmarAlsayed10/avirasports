'use client';

import { useEffect } from 'react';

interface Options {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function useSearchKeyboardShortcuts({ open, onToggle, onClose }: Options) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onToggle();
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onToggle, onClose]);
}
