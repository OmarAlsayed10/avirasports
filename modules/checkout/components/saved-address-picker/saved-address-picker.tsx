'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { GOVERNORATE_NAMES_AR } from '@/modules/_shared/constants/governorates.constants';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { cn } from '@/modules/_shared/utils/cn';
import { savedAddressPickerTokens } from './saved-address-picker.tokens';
import type { SavedAddressPickerProps } from './saved-address-picker.types';

export function SavedAddressPicker({ addresses, onSelect }: SavedAddressPickerProps) {
  const { t } = useLocale();
  const isAr = t.dir === 'rtl';
  const [open, setOpen] = useState(false);

  if (addresses.length === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={savedAddressPickerTokens.trigger}
      >
        {t.checkout.savedAddresses}
        <ChevronDown className={cn(savedAddressPickerTokens.chevron, open && 'rotate-180')} />
      </button>
      {open && (
        <div className={savedAddressPickerTokens.list}>
          {addresses.map((addr) => (
            <div key={addr.id} className={savedAddressPickerTokens.card}>
              <div className={savedAddressPickerTokens.cardText}>
                <p className={savedAddressPickerTokens.cardName}>{addr.fullName}</p>
                <p>{addr.addressLine}, {addr.city}</p>
                <p>
                  {isAr
                    ? (GOVERNORATE_NAMES_AR[addr.governorate as keyof typeof GOVERNORATE_NAMES_AR] ?? addr.governorate)
                    : addr.governorate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { onSelect(addr); setOpen(false); }}
                className={savedAddressPickerTokens.useBtn}
              >
                {t.checkout.useAddress}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
