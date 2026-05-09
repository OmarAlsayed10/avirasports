'use client';

import { useTransition } from 'react';
import { deleteProduct } from '@/lib/server-actions/admin/products';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';

export default function DeleteProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const { t } = useLocale();

  const handleClick = () => {
    if (!confirm(t.admin.deleteProductConfirm)) return;
    startTransition(async () => {
      await deleteProduct(id);
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="flex items-center gap-1 text-xs text-red-500 hover:underline font-medium disabled:opacity-50"
    >
      {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
      {t.admin.delete}
    </button>
  );
}
