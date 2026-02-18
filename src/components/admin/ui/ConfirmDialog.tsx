"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
  confirmLabel?: string;
  variant?: "danger" | "warning";
}

export function ConfirmDialog({
  isOpen, onClose, onConfirm, title, message, loading, confirmLabel = "تأكيد", variant = "danger"
}: ConfirmDialogProps) {
  const btnClass = variant === "danger"
    ? "bg-red-600 hover:bg-red-700 text-white"
    : "bg-yellow-500 hover:bg-yellow-600 text-white";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors">
            إلغاء
          </button>
          <button onClick={onConfirm} disabled={loading} className={`px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-60 ${btnClass}`}>
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
