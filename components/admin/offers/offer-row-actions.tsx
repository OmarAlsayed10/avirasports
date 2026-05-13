'use client';

import { useTransition } from 'react';
import { deleteOffer } from '@/lib/server-actions/admin/offers';
import { RowActions } from '@/components/admin/shared/row-actions';
import { useLocale } from '@/lib/i18n/context';

export default function OfferRowActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const { t } = useLocale();

  function handleDelete() {
    if (!confirm(t.admin.deleteProductConfirm)) return;
    startTransition(() => deleteOffer(id));
  }

  return (
    <RowActions
      actions={[
        { href: `/admin/offers/${id}/edit`, label: t.admin.edit },
        { onClick: handleDelete, label: isPending ? t.admin.saving : t.admin.delete, variant: 'danger', disabled: isPending },
      ]}
    />
  );
}
