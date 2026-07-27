"use client";

import { useState } from "react";
import { Modal } from "@/components/finance/Modal";

interface AddHabitModalProps {
  initial?: string;
  title?: string;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export function AddHabitModal({
  initial = "",
  title = "إضافة عادة جديدة",
  onClose,
  onSubmit,
}: AddHabitModalProps) {
  const [name, setName] = useState(initial);
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!name.trim()) return setError("اكتب اسم العادة");
    onSubmit(name.trim());
    onClose();
  }

  return (
    <Modal title={title} onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: شرب مياه"
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          autoFocus
        />
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
