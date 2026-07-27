"use client";

import { useState } from "react";
import { Modal } from "@/components/finance/Modal";
import { AdhkarCategory } from "@/types/adhkar";

// interface AddAdhkarModalProps {
//   category: AdhkarCategory;
//   onClose: () => void;
//   onSubmit: (data: { text: string; targetCount: number }) => void;
// }
interface AddAdhkarModalProps {
  category: AdhkarCategory;
  initial?: { text: string; targetCount: number };
  onClose: () => void;
  onSubmit: (data: { text: string; targetCount: number }) => void;
}
// وفي useState الأول: useState(initial?.text ?? "") و useState(String(initial?.targetCount ?? 1))

export function AddAdhkarModal({ onClose, onSubmit }: AddAdhkarModalProps) {
  const [text, setText] = useState("");
  const [targetCount, setTargetCount] = useState("1");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!text.trim()) return setError("اكتب نص الذكر");
    const count = Number(targetCount);
    if (!count || count <= 0) return setError("اكتب عدد صحيح");

    onSubmit({ text: text.trim(), targetCount: count });
    onClose();
  }

  return (
    <Modal title="إضافة ذكر جديد" onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <div>
          <p className="text-xs text-neutral-500 mb-1.5">نص الذكر</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <p className="text-xs text-neutral-500 mb-1.5">عدد المرات</p>
          <input
            type="number"
            value={targetCount}
            onChange={(e) => setTargetCount(e.target.value)}
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
