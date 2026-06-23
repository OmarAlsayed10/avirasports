export type VariantOption = {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  priceOverrideEgp?: number | null | { toNumber: () => number };
  stockCount: number;
  imageUrl?: string | null;
};

export interface VariantSelectorProps {
  variants: VariantOption[];
  selectedId: string | null;
  onSelect: (variantId: string | null) => void;
}
