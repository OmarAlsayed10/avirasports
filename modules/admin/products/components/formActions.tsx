import { Loader2, Eye } from 'lucide-react';

interface FormActionsProps {
  isPending: boolean;
  isEdit: boolean;
  submitLabel: string;
  updateLabel: string;
  cancelLabel: string;
  previewLabel: string;
  onPreview: () => void;
  onCancel: () => void;
}

export function FormActions({
  isPending,
  isEdit,
  submitLabel,
  updateLabel,
  cancelLabel,
  previewLabel,
  onPreview,
  onCancel,
}: FormActionsProps) {
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
      <button
        type="button"
        onClick={onPreview}
        className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        <Eye className="w-4 h-4" />
        {previewLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2.5 border border-gray-300 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        {cancelLabel}
      </button>
    </div>
  );
}
