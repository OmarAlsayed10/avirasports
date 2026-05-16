'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { GOVERNORATE_NAMES_AR } from '@/modules/_shared/constants/governorates.constants';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import type { SavedAddress } from '../hooks/use-addresses';

interface SavedAddressPickerProps {
  addresses: SavedAddress[];
  onSelect: (address: SavedAddress) => void;
}

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
        className="flex items-center gap-2 text-nav-sm font-semibold text-primary hover:text-primary/80 transition-colors"
      >
        {t.checkout.savedAddresses}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="flex items-start justify-between gap-3 p-3 border border-border-primary/20 rounded-btn-sm bg-bg-page"
            >
              <div className="text-xs text-text-primary leading-relaxed">
                <p className="font-semibold">{addr.fullName}</p>
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
                className="flex-shrink-0 text-xs font-semibold text-primary hover:underline"
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
