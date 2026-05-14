'use client';

import type { Category } from '@prisma/client';
import type { AdminProductInput } from '@/lib/validators/admin-product';
import { useLocale } from '@/lib/i18n/context';
import { useProductSubmit } from './use-product-submit';
import { BasicInfoSection } from './basicInfo';
import { PricingSection } from './pricing';
import { SettingsSection } from './settings';
import { SpecsSection } from './specs';
import { VariantsSection } from './variants';
import { FormActions } from './formActions';
import { ProductFormProvider } from './product-form-provider';
import { ImagesSection } from './images';
import { QuantityOffersSection } from './quantity-offers';

interface ProductFormProps {
  categories: Category[];
  brands: { id: string; name: string; slug: string }[];
  defaultValues?: Partial<AdminProductInput>;
  productId?: string;
}

export default function ProductForm({ categories, brands, defaultValues, productId }: ProductFormProps) {
  return (
    <ProductFormProvider defaultValues={defaultValues} productId={productId}>
      <ProductFormInnerWithEdit
        categories={categories}
        brands={brands}
        productId={productId}
      />
    </ProductFormProvider>
  );
}

function ProductFormInnerWithEdit({
  categories,
  brands,
  productId,
}: Pick<ProductFormProps, 'categories' | 'brands' | 'productId'>) {
  const { onSubmit, isPending } = useProductSubmit();
  const { t } = useLocale();

  return (
    <form onSubmit={onSubmit} className="space-y-6 pb-12">
      <BasicInfoSection categories={categories} brands={brands} />
      <PricingSection />
      <SettingsSection />
      <QuantityOffersSection />
      <SpecsSection />
      <ImagesSection />
      <VariantsSection />
      <FormActions
        isPending={isPending}
        isEdit={!!productId}
        submitLabel={t.admin.createProduct}
        updateLabel={t.admin.updateProduct}
        cancelLabel={t.admin.cancel}
      />
    </form>
  );
}