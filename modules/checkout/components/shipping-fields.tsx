'use client';

import type { UseFormReturn } from 'react-hook-form';
import { GOVERNORATES, GOVERNORATE_NAMES_AR } from '@/modules/_shared/constants/governorates.constants';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import type { ShippingFormInput } from '../checkout.validators';
import { FieldGroup } from './field-group';

interface ShippingFieldsProps {
  form: UseFormReturn<ShippingFormInput>;
}

export function ShippingFields({ form }: ShippingFieldsProps) {
  const { t } = useLocale();
  const isAr = t.dir === 'rtl';
  const { register, formState: { errors } } = form;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FieldGroup label={t.checkout.fullName} error={errors.fullName?.message} required>
        <input {...register('fullName')} type="text" placeholder={t.auth.fullNamePlaceholder} className="field-input" />
      </FieldGroup>

      <FieldGroup label={t.checkout.email} error={errors.email?.message} required>
        <input {...register('email')} type="email" placeholder="you@example.com" className="field-input" />
      </FieldGroup>

      <FieldGroup label={t.checkout.phone} error={errors.phone?.message} required className="sm:col-span-2">
        <input {...register('phone')} type="tel" placeholder="01xxxxxxxxx" className="field-input" />
      </FieldGroup>

      <FieldGroup label={t.checkout.address} error={errors.addressLine?.message} required className="sm:col-span-2">
        <input {...register('addressLine')} type="text" placeholder="123 El Nasr Street, Apartment 5" className="field-input" />
      </FieldGroup>

      <FieldGroup label={t.checkout.city} error={errors.city?.message} required>
        <input {...register('city')} type="text" placeholder="Cairo" className="field-input" />
      </FieldGroup>

      <FieldGroup label={t.checkout.governorate} error={errors.governorate?.message} required>
        <select {...register('governorate')} className="field-input">
          <option value="">{t.checkout.selectGovernorate}</option>
          {GOVERNORATES.map((g) => (
            <option key={g} value={g}>{isAr ? GOVERNORATE_NAMES_AR[g] : g}</option>
          ))}
        </select>
      </FieldGroup>

      <FieldGroup label={t.checkout.postalCode} error={errors.postalCode?.message}>
        <input {...register('postalCode')} type="text" placeholder={t.checkout.optional} className="field-input" />
      </FieldGroup>
    </div>
  );
}
