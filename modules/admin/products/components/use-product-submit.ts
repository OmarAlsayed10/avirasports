'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { type AdminProductInput } from '@/modules/product/product.validators';
import { createProduct, updateProduct } from '@/modules/product/product.service';
import { useProductForm } from './product-form-provider';

async function uploadPendingFile(tempId: string, file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
  const json = await res.json() as { url?: string; error?: string };
  if (!json.url) {
    toast.error(json.error ?? 'Image upload failed');
    return null;
  }
  return json.url;
}

export function useProductSubmit() {
  const { form, isEdit, productId, pendingFiles } = useProductForm();
  const [isPending, startTransition] = useTransition();

  const onSubmit = form.handleSubmit((data: AdminProductInput) => {
    startTransition(async () => {
      // Upload pending product images
      let finalImages = data.images;
      const imagesToUpload = finalImages.filter((img) => img.url.startsWith('pending:'));

      if (imagesToUpload.length > 0) {
        const results = await Promise.all(
          imagesToUpload.map(async (img) => {
            const pending = pendingFiles.get(img.url);
            if (!pending) return null;
            const realUrl = await uploadPendingFile(img.url, pending.file);
            return realUrl ? { tempId: img.url, realUrl } : null;
          })
        );

        if (results.some((r) => r === null)) return;

        const urlMap = new Map(results.map((r) => [r!.tempId, r!.realUrl]));
        finalImages = finalImages.map((img) => ({
          ...img,
          url: urlMap.get(img.url) ?? img.url,
        }));
      }

      // Upload pending variant color images
      let finalVariants = data.variants;
      const variantTempIds = Array.from(
        new Set(
          finalVariants
            .map((v) => v.imageUrl)
            .filter((url): url is string => typeof url === 'string' && url.startsWith('pending:'))
        )
      );

      if (variantTempIds.length > 0) {
        const variantResults = await Promise.all(
          variantTempIds.map(async (tempId) => {
            const pending = pendingFiles.get(tempId);
            if (!pending) return null;
            const realUrl = await uploadPendingFile(tempId, pending.file);
            return realUrl ? { tempId, realUrl } : null;
          })
        );

        if (variantResults.some((r) => r === null)) return;

        const variantUrlMap = new Map(variantResults.map((r) => [r!.tempId, r!.realUrl]));
        finalVariants = finalVariants.map((v) => ({
          ...v,
          imageUrl: v.imageUrl ? (variantUrlMap.get(v.imageUrl) ?? v.imageUrl) : v.imageUrl,
        }));
      }

      const finalData = { ...data, images: finalImages, variants: finalVariants };
      const result = isEdit
        ? await updateProduct(productId!, finalData)
        : await createProduct(finalData);

      if (result?.error) {
        for (const [field, messages] of Object.entries(result.error)) {
          form.setError(field as keyof AdminProductInput, {
            message: (messages as string[])[0],
          });
        }
      }
    });
  });

  return { onSubmit, isPending };
}
