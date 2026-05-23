import type { ReactNode } from 'react';

export interface FieldGroupProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}
