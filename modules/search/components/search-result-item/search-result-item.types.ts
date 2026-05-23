export interface ProductResultItemProps {
  item: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    priceEgp: number;
    discountPercent: number | null;
    imageUrl: string;
    imageAlt: string;
  };
  onSelect: (name: string) => void;
}

export interface CategoryResultItemProps {
  item: { id: string; slug: string; name: string };
  onSelect: (name: string) => void;
}
