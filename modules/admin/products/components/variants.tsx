'use client';

import { useMemo } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { useProductForm } from './product-form-provider';
import { SectionShell } from './section-shell';
import { VariantGenerator } from './variant-generator';
import { VariantTable } from './variant-table';

export function VariantsSection() {
  const { form } = useProductForm();
  const { control, register, watch, formState: { errors } } = form;
  const { t } = useLocale();

  const { fields, remove, append } = useFieldArray({ control, name: 'variants' });

  const attrNames = useMemo(() => {
    const hasColor = fields.some((f) => Boolean((f.attributes as Record<string, string>)?.color));
    return hasColor ? ['size', 'color'] : ['size'];
  }, [fields]);

  return (
    <SectionShell title={t.admin.variants}>
      <p className="text-xs text-gray-400 -mt-2 mb-5">{t.admin.variantsDesc}</p>

      <VariantGenerator slug={watch('slug')} onGenerate={(newVariants) => append(newVariants)} />

      <VariantTable
        fields={fields}
        attrNames={attrNames}
        register={register}
        errors={errors}
        onRemove={remove}
        t={t}
      />
    </SectionShell>
  );
}
