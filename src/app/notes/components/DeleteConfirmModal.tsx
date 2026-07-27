"use client";

import { Modal } from "@/components/finance/Modal";

export function DeleteConfirmModal({
  title = "تأكيد الحذف",
  message,
  onClose,
  onConfirm,
}: {
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-neutral-700">{message}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-neutral-200 py-2.5 text-sm"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white"
          >
            حذف
          </button>
        </div>
      </div>
    </Modal>
  );
}
