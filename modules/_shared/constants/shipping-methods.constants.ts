export const SHIPPING_METHODS = {
  STANDARD: {
    id: 'STANDARD',
    label: 'Standard Delivery',
    days: '3-5 business days',
    costEgp: 50,
  },
  EXPRESS: {
    id: 'EXPRESS',
    label: 'Express Delivery',
    days: '1-2 business days',
    costEgp: 120,
  },
} as const;

export type ShippingMethodId = keyof typeof SHIPPING_METHODS;
