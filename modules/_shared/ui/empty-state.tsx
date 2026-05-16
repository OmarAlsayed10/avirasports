import { cn } from '@/modules/_shared/utils/cn';

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 text-center gap-4', className)}>
      <div className="w-20 h-20 rounded-full bg-bg-page dark:bg-bg-surface border-2 border-border-primary dark:border-white/10 flex items-center justify-center">
        <span className="text-3xl">🛒</span>
      </div>
      <h3 className="text-card font-medium text-text-primary dark:text-text-on-dark">{title}</h3>
      {description && (
        <p className="text-nav-sm text-text-secondary dark:text-text-footer-link max-w-sm">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export default EmptyState;
