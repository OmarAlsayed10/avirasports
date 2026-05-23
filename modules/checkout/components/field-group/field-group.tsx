import { fieldGroupTokens } from './field-group.tokens';
import type { FieldGroupProps } from './field-group.types';

export function FieldGroup({ label, error, required, children, className }: FieldGroupProps) {
  return (
    <div className={className}>
      <label className={fieldGroupTokens.label}>
        {label}
        {required && <span className={fieldGroupTokens.requiredMark}>*</span>}
      </label>
      {children}
      {error && <p className={fieldGroupTokens.error}>{error}</p>}
    </div>
  );
}
