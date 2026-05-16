import type { ReactNode } from 'react';

interface FieldGroupProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FieldGroup({ label, error, required, children, className }: FieldGroupProps) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-text-primary mb-1.5">
        {label}
        {required && <span className="text-color-error ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-color-error mt-1">{error}</p>}
    </div>
  );
}
