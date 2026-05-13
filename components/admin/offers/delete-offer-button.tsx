'use client';

import { useTransition } from 'react';
import { deleteOffer } from '@/lib/server-actions/admin/offers';

export default function DeleteOfferButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm('Delete this offer? This cannot be undone.')) return;
    startTransition(() => deleteOffer(id));
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-xs text-red-500 hover:underline font-medium disabled:opacity-60"
    >
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
