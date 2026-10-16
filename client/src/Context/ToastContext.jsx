import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Toast from "../components/Toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const nextId = useRef(0);

  const removeToast = useCallback((id) => {
    const timer = timers.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (type, message, options = {}) => {
      const id = ++nextId.current;

      const toast = {
        id,
        type,
        message,
        title: options.title || "",
      };

      setToasts((current) => [...current, toast]);

      const duration = options.duration ?? 4000;

      if (duration > 0) {
        const timer = setTimeout(() => {
          removeToast(id);
        }, duration);

        timers.current.set(id, timer);
      }

      return id;
    },
    [removeToast]
  );

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current.clear();
    };
  }, []);

  const success = useCallback(
    (message, options) => showToast("success", message, options),
    [showToast]
  );

  const error = useCallback(
    (message, options) => showToast("error", message, options),
    [showToast]
  );

  const warning = useCallback(
    (message, options) => showToast("warning", message, options),
    [showToast]
  );

  const info = useCallback(
    (message, options) => showToast("info", message, options),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider")
  }

  return context;
}
