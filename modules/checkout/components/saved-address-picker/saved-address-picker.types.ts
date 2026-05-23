export type { SavedAddress } from '@/modules/checkout/hooks/use-addresses';

export interface SavedAddressPickerProps {
  addresses: import('@/modules/checkout/hooks/use-addresses').SavedAddress[];
  onSelect: (address: import('@/modules/checkout/hooks/use-addresses').SavedAddress) => void;
}
