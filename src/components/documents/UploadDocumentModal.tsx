"use client";

import { useState } from "react";
import { Modal } from "@/components/finance/Modal";

interface UploadDocumentModalProps {
  file: File;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export function UploadDocumentModal({
  file,
  onClose,
  onSubmit,
}: UploadDocumentModalProps) {
  const [name, setName] = useState(file.name.replace(/\.[^/.]+$/, ""));
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!name.trim()) return setError("اكتب اسم للوثيقة");
    onSubmit(name.trim());
    onClose();
  }

  return (
    <Modal title="حفظ الوثيقة" onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <div>
          <p className="text-xs text-neutral-500 mb-1.5">اسم الوثيقة</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-medium text-white"
        >
          حفظ
        </button>
      </div>
    </Modal>
  );
}
