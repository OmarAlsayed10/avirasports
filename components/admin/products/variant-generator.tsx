'use client';

import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';
import { DEFAULT_SIZES } from '@/lib/constants/sizes';

type SizeConfig = { colors: string[]; stock: number };

export type GeneratedVariant = {
  sku: string;
  attributes: Record<string, string>;
  stockCount: number;
  priceOverrideEgp: null;
  imageUrl: null;
};

// ── SizeColorPicker ──────────────────────────────────────────────────────────
interface SizeColorPickerProps {
  colors: string[];
  addLabel: string;
  stockLabel: string;
  stock: number;
  onAdd: (hex: string) => void;
  onRemove: (hex: string) => void;
  onStockChange: (n: number) => void;
}

function SizeColorPicker({ colors, addLabel, stockLabel, stock, onAdd, onRemove, onStockChange }: SizeColorPickerProps) {
  const [pending, setPending] = useState('#000000');

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {colors.map((c) => (
          <div key={c} className="relative group">
            <div className="w-7 h-7 rounded-full border-2 border-gray-200" style={{ backgroundColor: c }} />
            <button
              type="button"
              onClick={() => onRemove(c)}
              className="absolute -top-1 -right-1 w-4 h-4 bg-white border border-gray-300 rounded-full items-center justify-center hidden group-hover:flex"
            >
              <X className="w-2.5 h-2.5 text-gray-500" />
            </button>
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

// ── VariantGenerator ─────────────────────────────────────────────────────────
interface VariantGeneratorProps {
  slug: string;
  onGenerate: (variants: GeneratedVariant[]) => void;
}

export function VariantGenerator({ slug, onGenerate }: VariantGeneratorProps) {
  const { t } = useLocale();
  const [configs, setConfigs] = useState<Record<string, SizeConfig>>({});

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

  const removeColor = (size: string, hex: string) =>
    setConfigs((prev) => ({
      ...prev,
      [size]: { ...prev[size], colors: prev[size].colors.filter((c) => c !== hex) },
    }));

  const updateStock = (size: string, stock: number) =>
    setConfigs((prev) => ({ ...prev, [size]: { ...prev[size], stock } }));

  const variantCount = useMemo(
    () =>
      selectedSizes.reduce((acc, size) => {
        const cfg = configs[size];
        return acc + (cfg.colors.length > 0 ? cfg.colors.length : 1);
      }, 0),
    [configs, selectedSizes],
  );

  const handleGenerate = () => {
    const base = slug || 'product';
    onGenerate(
      selectedSizes.flatMap((size) => {
        const { colors, stock } = configs[size];
        return colors.length > 0
          ? colors.map((color) => ({
              sku: `${base}-${size}-${color.replace('#', '')}`,
              attributes: { size, color },
              stockCount: stock,
              priceOverrideEgp: null as null,
              imageUrl: null as null,
            }))
          : [{ sku: `${base}-${size}`, attributes: { size }, stockCount: stock, priceOverrideEgp: null as null, imageUrl: null as null }];
      }),
    );
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 space-y-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t.admin.quickGenerate}</p>

      {/* Size toggles */}
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

      {/* Per-size color + stock */}
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
                addLabel={t.admin.addColor}
                stockLabel={t.admin.stockHeader}
                stock={configs[size].stock}
                onAdd={(hex) => addColor(size, hex)}
                onRemove={(hex) => removeColor(size, hex)}
                onStockChange={(n) => updateStock(size, n)}
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
