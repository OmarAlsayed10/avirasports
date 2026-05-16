'use client';

import { useTransition } from 'react';
import { deleteOffer } from '@/modules/admin/offers/offers.service';
import { RowActions } from '@/modules/admin/_shared/components/row-actions';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';

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
