'use client';

import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminProductSchema, type AdminProductInput } from '@/lib/validators/admin-product';

export type PendingFileMap = Map<string, { file: File; preview: string }>;

interface ProductFormContextValue {
  form: UseFormReturn<AdminProductInput>;
  isEdit: boolean;
  productId?: string;
  pendingFiles: PendingFileMap;
  setPendingFiles: React.Dispatch<React.SetStateAction<PendingFileMap>>;
}

const ProductFormContext = createContext<ProductFormContextValue | null>(null);

export function useProductForm() {
  const ctx = useContext(ProductFormContext);
  if (!ctx) throw new Error('useProductForm must be used inside <ProductFormProvider>');
  return ctx;
}

interface ProductFormProviderProps {
  children: React.ReactNode;
  defaultValues?: Partial<AdminProductInput>;
  productId?: string;
}

export function ProductFormProvider({ children, defaultValues, productId }: ProductFormProviderProps) {
  const isEdit = !!productId;

  const [pendingFiles, setPendingFiles] = useState<PendingFileMap>(() => new Map());
  const pendingFilesRef = useRef(pendingFiles);
  pendingFilesRef.current = pendingFiles;

  // Revoke object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      pendingFilesRef.current.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, []);

  const form = useForm<AdminProductInput>({
    resolver: zodResolver(adminProductSchema),
    defaultValues: {
      name: '',
      nameAr: '',
      brand: '',
      gender: 'ALL',
      modelNumber: '',
      slug: '',
      description: '',
      descriptionAr: '',
      specs: [],
      categoryId: '',
      basePriceEgp: 0,
      discountPercent: null,
      isActive: true,
      isFeatured: false,
      isHolidayOffer: false,
      images: [],
      variants: [],
      quantityOffers: [],
      ...defaultValues,
    },
  });

  return (
    <ProductFormContext.Provider value={{ form, isEdit, productId, pendingFiles, setPendingFiles }}>
      {children}
    </ProductFormContext.Provider>
  );
}