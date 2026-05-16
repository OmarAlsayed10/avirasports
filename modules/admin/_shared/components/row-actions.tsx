'use client';

import * as Popover from '@radix-ui/react-popover';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/modules/_shared/utils/cn';

export type RowAction = {
  label: string;
  variant?: 'default' | 'danger';
  disabled?: boolean;
} & ({ href: string } | { onClick: () => void });

interface RowActionsProps {
  actions: RowAction[];
}

export function RowActions({ actions }: RowActionsProps) {
  function renderItem(action: RowAction, index: number, mobile: boolean) {
    const isDanger = action.variant === 'danger';
    const desktopCls = cn(
      'text-xs font-medium transition-colors',
      isDanger ? 'text-red-500 hover:text-red-600' : 'text-primary-btn hover:underline',
      action.disabled && 'opacity-40 pointer-events-none'
    );
    const mobileCls = cn(
      'flex w-full items-center px-4 py-2.5 text-sm font-medium text-left transition-colors',
      isDanger ? 'text-red-500 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50',
      action.disabled && 'opacity-40 pointer-events-none'
    );

    if ('href' in action) {
      return (
        <Link key={index} href={action.href} className={mobile ? mobileCls : desktopCls}>
          {action.label}
        </Link>
      );
    }

    return (
      <button
        key={index}
        type="button"
        disabled={action.disabled}
        onClick={action.onClick}
        className={mobile ? mobileCls : desktopCls}
      >
        {action.label}
      </button>
    );
  }

  return (
    <>
      <div className="hidden lg:flex items-center gap-3 justify-end">
        {actions.map((a, i) => renderItem(a, i, false))}
      </div>

      <div className="lg:hidden">
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              type="button"
              className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Row actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              align="end"
              side="top"
              sideOffset={4}
              className="z-[9999] min-w-[130px] bg-white rounded-lg border border-gray-200 shadow-xl py-1"
            >
              {actions.map((a, i) => renderItem(a, i, true))}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </>
  );
}
