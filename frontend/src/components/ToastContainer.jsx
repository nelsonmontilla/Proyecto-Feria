import React from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { useNotificationToast } from "../hooks/useNotificationToast";

export default function ToastContainer() {
  const { notifications, dismiss } = useNotificationToast();

  if (!notifications || notifications.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {notifications.map((item) => {
        const isError = item.type === "error";
        const isWarning = item.type === "warning";

        return (
          <div
            key={item.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-card border backdrop-blur-md transition-all duration-200 ${
              isError
                ? "bg-red-50/95 border-red-200 text-red-900"
                : isWarning
                ? "bg-amber-50/95 border-amber-200 text-amber-900"
                : "bg-white/95 border-brand-cyan/40 text-brand-navy"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isError ? (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              ) : isWarning ? (
                <Info className="w-5 h-5 text-brand-amber" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-brand-teal" />
              )}
            </div>
            <div className="flex-1 text-sm">
              <p className="font-bold font-display">{item.title}</p>
              <p className="text-xs mt-0.5 opacity-90 leading-relaxed">{item.message}</p>
            </div>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Cerrar notificación"
              className="p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 opacity-70" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
