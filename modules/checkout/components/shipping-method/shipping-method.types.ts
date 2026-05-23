export interface ShippingMethodSelectorProps {
  selected: 'STANDARD' | 'EXPRESS';
  onChange: (method: 'STANDARD' | 'EXPRESS') => void;
}
