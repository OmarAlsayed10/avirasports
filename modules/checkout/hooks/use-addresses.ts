'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  governorate: string;
  postalCode?: string | null;
  isDefault: boolean;
}

export function useAddresses() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);

  useEffect(() => {
    if (!session?.user) return;
    fetch('/api/account/addresses')
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) setAddresses(data as SavedAddress[]);
      })
      .catch(() => {});
  }, [session]);

  return addresses;
}
