"use client";

import { FileText, ListChecks, Image, Pencil } from "lucide-react";
import { Modal } from "@/components/finance/Modal";
import { NoteType } from "../types/notes";

const TYPES: { type: NoteType; label: string; icon: typeof FileText }[] = [
  { type: "text", label: "كتابة", icon: FileText },
  { type: "todo", label: "تودو ليست", icon: ListChecks },
  { type: "image", label: "صورة", icon: Image },
  { type: "drawing", label: "رسمة", icon: Pencil },
];

export function NoteTypePickerModal({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (type: NoteType) => void;
}) {
  return (
    <Modal title="نوع النوت" onClose={onClose}>
      <div className="grid grid-cols-2 gap-2">
        {TYPES.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className="flex flex-col items-center gap-2 rounded-xl border border-neutral-200 py-4 hover:bg-neutral-50"
          >
            <Icon size={20} />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
