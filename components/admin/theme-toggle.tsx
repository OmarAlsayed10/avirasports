'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useEffect, useState } from 'react';

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className={cn(
        'flex items-center justify-center w-8 h-8 rounded-full border border-white/30 text-white/70 hover:bg-white/10 hover:text-white transition-colors shrink-0',
        className
      )}
    >
      {mounted && resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
