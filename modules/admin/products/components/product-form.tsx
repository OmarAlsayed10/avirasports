'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Category } from '@prisma/client';
import type { AdminProductInput } from '@/modules/product/product.validators';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { useProductSubmit } from './use-product-submit';
import { BasicInfoSection } from './basicInfo';
import { PricingSection } from './pricing';
import { SettingsSection } from './settings';
import { SpecsSection } from './specs';
import { VariantsSection } from './variants';
import { FormActions } from './formActions';
import { ProductFormProvider, useProductForm } from './product-form-provider';
import { ImagesSection } from './images';
import { QuantityOffersSection } from './quantity-offers';
import { ProductPreviewModal } from './product-preview-modal';
import { AddOnOptionsSection } from './add-on-options';
import { SizeWeightsSection } from './size-weights';

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
  const { form } = useProductForm();
  const { t } = useLocale();
  const router = useRouter();
  const [previewOpen, setPreviewOpen] = useState(false);
  const selectedCategoryId = form.watch('categoryId');
  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);

  const handleCancel = () => {
    if (form.formState.isDirty && !confirm(t.admin.discardChangesConfirm)) return;
    router.push('/admin/products');
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 pb-12">
      <BasicInfoSection categories={categories} brands={brands} />
      <PricingSection />
      <SettingsSection />
      <QuantityOffersSection />
      <AddOnOptionsSection />
      <SizeWeightsSection />
      <SpecsSection />
      <ImagesSection />
      <VariantsSection hasMultipleSizes={selectedCategory?.hasMultipleSizes} />
      <FormActions
        isPending={isPending}
        isEdit={!!productId}
        submitLabel={t.admin.createProduct}
        updateLabel={t.admin.updateProduct}
        cancelLabel={t.admin.cancel}
        previewLabel={t.admin.preview}
        onPreview={() => setPreviewOpen(true)}
        onCancel={handleCancel}
      />
      {previewOpen && <ProductPreviewModal onClose={() => setPreviewOpen(false)} />}
    </form>
  );
}
