import { cn } from '@/modules/_shared/utils/cn';
import { emptyStateTokens as tk } from './empty-state.tokens';
import type { EmptyStateProps } from './empty-state.types';

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn(tk.wrapper, className)}>
      <div className={tk.icon}>
        <span className="text-3xl">🛒</span>
      </div>
      <h3 className={tk.title}>{title}</h3>
      {description && <p className={tk.description}>{description}</p>}
      {action && <div className={tk.action}>{action}</div>}
    </div>
  );
}

export default EmptyState;
