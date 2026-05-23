import type { UseFormReturn } from 'react-hook-form';
import type { ShippingFormInput } from '@/modules/checkout/checkout.validators';

export interface ShippingFieldsProps {
  form: UseFormReturn<ShippingFormInput>;
}
