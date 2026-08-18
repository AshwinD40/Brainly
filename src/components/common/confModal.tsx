import { useEffect, type ReactNode } from "react";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

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
  icon?: ReactNode;
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
  useEffect(() => {
    if (!open) {
      return;
    }

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [loading, onCancel, open]);

  if (!open) return null;

  const isDanger = variant === "danger";
  const AccentIcon = isDanger ? FiAlertTriangle : FiCheckCircle;
  const accentIcon = icon ?? <AccentIcon className="text-base" />;

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_28%),rgba(3,7,18,0.76)] px-4 py-6 backdrop-blur-md"
      onClick={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onCancel();
        }
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-white/12 bg-white/[0.07] shadow-[0_38px_90px_-48px_rgba(0,0,0,0.98)] backdrop-blur-2xl animate-scaleIn">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),transparent_38%,transparent_62%,rgba(255,255,255,0.06))]" />
        <div className="absolute left-6 right-6 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />
        <div
          className={`absolute -top-16 right-4.5 h-36 w-36 rounded-full blur-3xl ${
            isDanger ? "bg-red-500/14" : "bg-white/10"
          }`}
        />

        <div className="relative p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
                isDanger
                  ? "border-red-400/20 bg-red-500/30 text-red-200"
                  : "border-white/12 bg-white/9 text-white"
              }`}
            >
              {accentIcon}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-white sm:text-[1.15rem]">
                {title}
              </h3>
              {description && (
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 curser-pointer sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="inline-flex h-11  items-center justify-center rounded-2xl border border-white/10 bg-white/4 px-4 text-sm font-medium text-neutral-300 transition-all hover:border-white/16 hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                isDanger
                  ? "border-red-400/24 bg-[linear-gradient(180deg,rgba(220,38,38,0.88),rgba(153,27,27,0.92))] text-white shadow-[0_16px_35px_-22px_rgba(220,38,38,0.85)] hover:brightness-110"
                  : "border-white/18 bg-[linear-gradient(180deg,rgba(245,245,245,0.94),rgba(214,214,214,0.92))] text-neutral-950 shadow-[0_16px_35px_-22px_rgba(255,255,255,0.55)] hover:brightness-105"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="h-3.5 w-3.5 animate-spin"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="6"
                      cy="6"
                      r="4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeOpacity="0.25"
                    />
                    <path
                      d="M6 1.5A4.5 4.5 0 0110.5 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
