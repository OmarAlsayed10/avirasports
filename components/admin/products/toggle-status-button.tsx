'use client';

import { useTransition } from 'react';
import { toggleProductStatus } from '@/lib/server-actions/admin/products';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';

export default function ToggleStatusButton({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const { t } = useLocale();

  const handleClick = () => {
    startTransition(async () => {
      await toggleProductStatus(id, !isActive);
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors disabled:opacity-60 ${
        isActive
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
    >
      {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
      {isActive ? t.admin.active : t.admin.inactive}
    </button>
  );
}
