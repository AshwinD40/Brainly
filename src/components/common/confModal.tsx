
interface ConfirmationModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  variant?: "danger" | "primary";
  icon?: React.ReactNode;
}

export const ConfirmationModal = ({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  variant = "primary",
  icon,
}: ConfirmationModalProps) => {
  if (!open) return null;

  const variantStyles =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-800"
      : "bg-neutral-100 hover:bg-neutral-300";

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-neutral-100/10 backdrop-blur-sm rounded-2xl p-6 w-[90%] max-w-sm shadow-xl animate-scaleIn">
        <div className="flex items-center gap-3 mb-3">
          {icon && (
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-neutral-50">
            {title}
          </h3>
        </div>

        {description && (
          <p className="text-sm text-neutral-400 mb-6">
            {description}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border text-neutral-400 text-sm hover:bg-neutral-800 transition"
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white text-sm transition ${variantStyles}`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
