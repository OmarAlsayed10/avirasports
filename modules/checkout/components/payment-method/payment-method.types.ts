export type PaymentMethod = 'CARD' | 'PAY_AT_FAWRY';

export interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}
