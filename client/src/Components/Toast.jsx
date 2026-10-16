
export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const styles = {
    success: {
      icon: "✓",
      container: "border-emerald-200 bg-emerald-50 text-emerald-900",
      iconStyle: "bg-emerald-100 text-emerald-700",
    },
    error: {
      icon: "✕",
      container: "border-red-200 bg-red-50 text-red-900",
      iconStyle: "bg-red-100 text-red-700",
    },
    warning: {
      icon: "!",
      container: "border-amber-200 bg-amber-50 text-amber-900",
      iconStyle: "bg-amber-100 text-amber-700",
    },
    info: {
      icon: "i",
      container: "border-blue-200 bg-blue-50 text-blue-900",
      iconStyle: "bg-blue-100 text-blue-700",
    },
  };

  const style = styles[toast.type] || styles.info;

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      aria-live={toast.type === "error" ? "assertive" : "polite"}
      className={`pointer-events-auto flex w-full max-w-sm items-center gap-2.5 rounded-lg border px-3 py-2 shadow-md animate-toast-in ${style.container}`}
    >
      <span
        className={`flex size-6 shrink-0 items-center justify-center rounded-full font-bold ${style.iconStyle}`}
      >
        {style.icon}
      </span>

      <div className="min-w-0 flex-1">
        {toast.title && (
          <p className="font-semibold">{toast.title}</p>
        )}
        <p className="mt-1 break-words text-xs">{toast.message}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className="shrink-0 text-lg opacity-60 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
