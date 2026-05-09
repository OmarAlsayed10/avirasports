'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="w-6 h-6" />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="p-1 text-text-primary dark:text-text-on-dark hover:text-primary-btn dark:hover:text-primary-btn transition-colors"
    >
      {theme === 'dark'
        ? <Sun className="w-5 h-5" />
        : <Moon className="w-5 h-5" />
      }
    </button>
  );
}
