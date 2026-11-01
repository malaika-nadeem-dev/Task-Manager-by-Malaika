import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  taskTitle?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">Delete Task?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">&ldquo;{taskTitle || 'this task'}&rdquo;</strong>? This action will permanently remove it from your Cloud Firestore database.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs sm:text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md shadow-rose-100 flex items-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting...' : 'Delete Task'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
