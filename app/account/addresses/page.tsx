'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Check } from 'lucide-react';
import Link from 'next/link';
import { addressSchema, type AddressInput } from '@/lib/validators/address';
import { createAddress, deleteAddress, setDefaultAddress } from '@/lib/server-actions/account';
import { GOVERNORATES, GOVERNORATE_NAMES_AR } from '@/lib/constants/governorates';
import { toast } from 'sonner';
import { useLocale } from '@/lib/i18n/context';
import { createZodErrorMap } from '@/lib/i18n/zod-error-map';

type Address = {
  id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  governorate: string;
  postalCode: string | null;
  isDefault: boolean;
};

async function fetchAddresses(): Promise<Address[]> {
  const res = await fetch('/api/account/addresses');
  if (!res.ok) return [];
  return res.json();
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLocale();

  const resolver = useMemo(() => zodResolver(addressSchema, { errorMap: createZodErrorMap(t) }), [t]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressInput>({
    resolver,
    defaultValues: { isDefault: false },
  });

  useEffect(() => {
    fetchAddresses().then(setAddresses);
  }, []);

  const onSubmit = async (data: AddressInput) => {
    setIsLoading(true);
    const result = await createAddress(data);
    setIsLoading(false);
    if (result.ok) {
      toast.success(t.account.addressSaved);
      reset();
      setShowForm(false);
      fetchAddresses().then(setAddresses);
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteAddress(id);
    if (result.ok) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success(t.account.addressRemoved);
    } else {
      toast.error(result.error);
    }
  };

  const handleSetDefault = async (id: string) => {
    const result = await setDefaultAddress(id);
    if (result.ok) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-site py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/account" className="text-nav-sm text-text-secondary hover:text-primary">
          {t.dir === 'rtl' ? '→' : '←'} {t.account.title}
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-section-heading font-semibold text-text-primary">{t.account.addresses}</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          {t.account.addAddress}
        </button>
      </div>

      {/* Add address form */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-white rounded-card-lg border border-border-primary/10 p-6 space-y-4 mb-6" noValidate>
          <h2 className="text-nav-sm font-semibold text-text-primary">{t.account.newAddress}</h2>

          <div>
            <label className="block text-nav-sm font-medium text-text-primary mb-1.5" htmlFor="fullName">{t.auth.fullName}</label>
            <input id="fullName" type="text" {...register('fullName')} className="field-input" />
            {errors.fullName && <p className="text-xs text-sale mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-nav-sm font-medium text-text-primary mb-1.5" htmlFor="addrPhone">{t.auth.phone}</label>
            <input id="addrPhone" type="tel" {...register('phone')} className="field-input" placeholder="01xxxxxxxxx" />
            {errors.phone && <p className="text-xs text-sale mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-nav-sm font-medium text-text-primary mb-1.5" htmlFor="addressLine">{t.checkout.address}</label>
            <input id="addressLine" type="text" {...register('addressLine')} className="field-input" placeholder="Street, building, apartment" />
            {errors.addressLine && <p className="text-xs text-sale mt-1">{errors.addressLine.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-nav-sm font-medium text-text-primary mb-1.5" htmlFor="city">{t.checkout.city}</label>
              <input id="city" type="text" {...register('city')} className="field-input" />
              {errors.city && <p className="text-xs text-sale mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="block text-nav-sm font-medium text-text-primary mb-1.5" htmlFor="governorate">{t.checkout.governorate}</label>
              <select id="governorate" {...register('governorate')} className="field-input">
                <option value="">{t.checkout.selectGovernorate}</option>
                {GOVERNORATES.map((g) => (
                  <option key={g} value={g}>{t.dir === 'rtl' ? GOVERNORATE_NAMES_AR[g] : g}</option>
                ))}
              </select>
              {errors.governorate && <p className="text-xs text-sale mt-1">{errors.governorate.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-nav-sm font-medium text-text-primary mb-1.5" htmlFor="postalCode">{t.account.postalCodeOptional}</label>
            <input id="postalCode" type="text" {...register('postalCode')} className="field-input" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('isDefault')} className="w-4 h-4 text-primary" />
            <span className="text-nav-sm text-text-primary">{t.account.setAsDefaultAddress}</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isLoading} className="flex-1 h-12 bg-primary text-text-on-dark rounded-btn-sm text-nav-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">
              {isLoading ? t.account.saving : t.account.saveAddress}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 h-12 border border-border-primary/40 rounded-btn-sm text-nav-sm font-semibold text-text-primary hover:border-primary transition-colors">
              {t.account.cancel}
            </button>
          </div>
        </form>
      )}

      {/* Address list */}
      {addresses.length === 0 && !showForm && (
        <div className="bg-bg-white rounded-card-lg border border-border-primary/10 p-10 text-center">
          <p className="text-nav-sm text-text-secondary">{t.account.noAddresses}</p>
        </div>
      )}

      <div className="space-y-4">
        {addresses.map((addr) => (
          <div key={addr.id} className={`bg-bg-white rounded-card-lg border p-5 ${addr.isDefault ? 'border-primary' : 'border-border-primary/10'}`}>
            {addr.isDefault && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mb-2">
                <Check className="w-3.5 h-3.5" /> {t.account.addressDefault}
              </span>
            )}
            <p className="text-nav-sm font-semibold text-text-primary">{addr.fullName}</p>
            <p className="text-nav-sm text-text-secondary">{addr.addressLine}</p>
            <p className="text-nav-sm text-text-secondary">{addr.city}, {t.dir === 'rtl' ? (GOVERNORATE_NAMES_AR[addr.governorate as keyof typeof GOVERNORATE_NAMES_AR] ?? addr.governorate) : addr.governorate}{addr.postalCode ? ` ${addr.postalCode}` : ''}</p>
            <p className="text-nav-sm text-text-secondary">{addr.phone}</p>
            <div className="flex gap-3 mt-3">
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  {t.account.setDefault}
                </button>
              )}
              <button
                onClick={() => handleDelete(addr.id)}
                className="flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-sale transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> {t.account.removeAddress}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
