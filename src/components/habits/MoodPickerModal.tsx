"use client";

import { Mood } from "@/types/habits";
import { Modal } from "@/components/finance/Modal";
import { MOOD_OPTIONS } from "@/lib/habits";

export function MoodPickerModal({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (mood: Mood) => void;
}) {
  return (
    <Modal title="مزاجك النهاردة إيه؟" onClose={onClose}>
      <div className="grid grid-cols-5 gap-2">
        {MOOD_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onSelect(option.value);
              onClose();
            }}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-neutral-200 py-3 hover:bg-neutral-50"
          >
            <span className="text-2xl">{option.emoji}</span>
            <span className="text-[10px] text-neutral-500">{option.label}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
