import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  isPending: boolean;
  isEdit: boolean;
  submitLabel: string;
  updateLabel: string;
  cancelLabel: string;
}

export function FormActions({ isPending, isEdit, submitLabel, updateLabel, cancelLabel }: FormActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 px-6 py-2.5 bg-primary-btn text-white rounded-md text-sm font-semibold hover:bg-primary-btn/90 disabled:opacity-60 transition-colors"
      >
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        {isEdit ? updateLabel : submitLabel}
      </button>
      <a
        href="/admin/products"
        className="px-5 py-2.5 border border-gray-300 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        {cancelLabel}
      </a>
    </div>
  );
}