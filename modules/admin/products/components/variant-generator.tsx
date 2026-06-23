'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { X, ImageIcon } from 'lucide-react';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';
import { DEFAULT_SIZES } from '@/modules/_shared/constants/sizes.constants';
import { useProductForm } from './product-form-provider';

type SizeConfig = { colors: string[]; stock: number };

export type GeneratedVariant = {
  sku: string;
  attributes: Record<string, string>;
  stockCount: number;
  priceOverrideEgp: null;
  imageUrl: string | null;
};

interface SizeColorPickerProps {
  colors: string[];
  colorPreviews: Record<string, string>;
  addLabel: string;
  stockLabel: string;
  stock: number;
  onAdd: (hex: string) => void;
  onRemove: (hex: string) => void;
  onStockChange: (n: number) => void;
  onImageUpload: (hex: string, file: File) => void;
  onImageRemove: (hex: string) => void;
  removeImageLabel: string;
  addPhotoLabel: string;
}

function SizeColorPicker({ colors, colorPreviews, addLabel, stockLabel, stock, onAdd, onRemove, onStockChange, onImageUpload, onImageRemove, removeImageLabel, addPhotoLabel }: SizeColorPickerProps) {
  const [pending, setPending] = useState('#000000');

  return (
    <>
      <div className="flex flex-wrap items-start gap-3 flex-1">
        {colors.map((c) => (
          <div key={c} className="relative group flex flex-col items-center gap-1.5">
            <div className="relative">
              <div className="w-7 h-7 rounded-full border-2 border-gray-200" style={{ backgroundColor: c }} />
              <button
                type="button"
                onClick={() => onRemove(c)}
                title={c}
                className="absolute -top-1 -right-1 w-4 h-4 bg-white border border-gray-300 rounded-full items-center justify-center hidden group-hover:flex"
              >
                <X className="w-2.5 h-2.5 text-gray-500" />
              </button>
            </div>
            {colorPreviews[c] ? (
              <div className="relative w-16 h-16 rounded-md border border-gray-200 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={colorPreviews[c]} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onImageRemove(c)}
                  title={removeImageLabel}
                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white"
                >
                  <X className="w-3 h-3 text-red-500" />
                </button>
              </div>
            ) : (
              <label
                className="w-16 h-16 rounded-md border border-dashed border-gray-300 flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:border-primary text-gray-400"
                title={addPhotoLabel}
              >
                <ImageIcon className="w-4 h-4" />
                <span className="text-[9px] leading-none text-center px-1">{addPhotoLabel}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onImageUpload(c, file);
                    e.target.value = '';
                  }}
                />
              </label>
            )}
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <input
            type="color"
            value={pending}
            onChange={(e) => setPending(e.target.value)}
            className="w-7 h-7 p-0.5 border border-gray-300 rounded-full cursor-pointer bg-white"
          />
          <button
            type="button"
            onClick={() => { if (!colors.includes(pending)) onAdd(pending); }}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-xs font-medium transition-colors"
          >
            {addLabel}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <label className="text-xs text-gray-400">{stockLabel}</label>
        <input
          type="number"
          min="0"
          value={stock}
          onChange={(e) => onStockChange(Number(e.target.value))}
          className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>
    </>
  );
}

interface VariantGeneratorProps {
  slug: string;
  onGenerate: (variants: GeneratedVariant[]) => void;
}

export function VariantGenerator({ slug, onGenerate }: VariantGeneratorProps) {
  const { t } = useLocale();
  const { setPendingFiles } = useProductForm();
  const [configs, setConfigs] = useState<Record<string, SizeConfig>>({});
  const [colorImages, setColorImages] = useState<Record<string, { file: File; preview: string }>>({});
  const colorImagesRef = useRef(colorImages);
  colorImagesRef.current = colorImages;

  useEffect(() => {
    return () => {
      Object.values(colorImagesRef.current).forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, []);

  const selectedSizes = DEFAULT_SIZES.filter((s) => configs[s]);

  const toggleSize = (size: string) =>
    setConfigs((prev) => {
      const next = { ...prev };
      if (next[size]) delete next[size];
      else next[size] = { colors: [], stock: 10 };
      return next;
    });

  const addColor = (size: string, hex: string) =>
    setConfigs((prev) => ({
      ...prev,
      [size]: { ...prev[size], colors: [...prev[size].colors, hex] },
    }));

  const removeColor = (size: string, hex: string) => {
    const stillUsed = Object.entries(configs)
      .filter(([s]) => s !== size)
      .some(([, cfg]) => cfg.colors.includes(hex));
    if (!stillUsed && colorImages[hex]) {
      URL.revokeObjectURL(colorImages[hex].preview);
      setColorImages((prev) => { const n = { ...prev }; delete n[hex]; return n; });
    }
    setConfigs((prev) => ({
      ...prev,
      [size]: { ...prev[size], colors: prev[size].colors.filter((c) => c !== hex) },
    }));
  };

  const updateStock = (size: string, stock: number) =>
    setConfigs((prev) => ({ ...prev, [size]: { ...prev[size], stock } }));

  const handleImageUpload = (hex: string, file: File) => {
    if (colorImages[hex]) URL.revokeObjectURL(colorImages[hex].preview);
    const preview = URL.createObjectURL(file);
    setColorImages((prev) => ({ ...prev, [hex]: { file, preview } }));
  };

  const handleImageRemove = (hex: string) => {
    if (!colorImages[hex]) return;
    URL.revokeObjectURL(colorImages[hex].preview);
    setColorImages((prev) => { const n = { ...prev }; delete n[hex]; return n; });
  };

  const variantCount = useMemo(
    () =>
      selectedSizes.reduce((acc, size) => {
        const cfg = configs[size];
        return acc + (cfg.colors.length > 0 ? cfg.colors.length : 1);
      }, 0),
    [configs, selectedSizes],
  );

  const colorPreviews = useMemo(
    () => Object.fromEntries(Object.entries(colorImages).map(([hex, { preview }]) => [hex, preview])),
    [colorImages],
  );

  const handleGenerate = () => {
    const base = slug || 'product';

    const newVariants: GeneratedVariant[] = selectedSizes.flatMap((size) => {
      const { colors, stock } = configs[size];
      return colors.length > 0
        ? colors.map((color): GeneratedVariant => ({
            sku: `${base}-${size}-${color.replace('#', '')}`,
            attributes: { size, color },
            stockCount: stock,
            priceOverrideEgp: null,
            imageUrl: colorImages[color] ? `pending:color-img-${color.replace('#', '')}` : null,
          }))
        : [{ sku: `${base}-${size}`, attributes: { size }, stockCount: stock, priceOverrideEgp: null, imageUrl: null }];
    });

    const pendingEntries = Object.entries(colorImages)
      .map(([hex, data]) => [`pending:color-img-${hex.replace('#', '')}`, data] as const);

    if (pendingEntries.length > 0) {
      setPendingFiles((prev) => {
        const next = new Map(prev);
        pendingEntries.forEach(([tempId, data]) => next.set(tempId, data));
        return next;
      });
    }

    onGenerate(newVariants);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 space-y-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t.admin.quickGenerate}</p>

      <div>
        <p className="text-xs text-gray-500 mb-2">{t.admin.sizesLabel}</p>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                configs[size]
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-primary'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {selectedSizes.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">{t.admin.colorsStockLabel}</p>
          {selectedSizes.map((size) => (
            <div
              key={size}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg px-4 py-3"
            >
              <span className="text-sm font-semibold text-gray-700 w-10 shrink-0">{size}</span>
              <SizeColorPicker
                colors={configs[size].colors}
                colorPreviews={colorPreviews}
                addLabel={t.admin.addColor}
                stockLabel={t.admin.stockHeader}
                stock={configs[size].stock}
                onAdd={(hex) => addColor(size, hex)}
                onRemove={(hex) => removeColor(size, hex)}
                onStockChange={(n) => updateStock(size, n)}
                onImageUpload={handleImageUpload}
                onImageRemove={handleImageRemove}
                removeImageLabel={t.admin.removeImage}
                addPhotoLabel={t.admin.addPhoto}
              />
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={selectedSizes.length === 0}
        className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {selectedSizes.length > 0 ? t.admin.generateCount(variantCount) : t.admin.generateVariants}
      </button>
    </div>
  );
}
