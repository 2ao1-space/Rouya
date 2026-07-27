"use client";

import { useState } from "react";
import { AdhkarItem } from "@/types/adhkar";
import { SquarePen, Trash2 } from "lucide-react";

interface AdhkarItemCardProps {
  item: AdhkarItem;
  remaining: number;
  onTap: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function AdhkarItemCard({
  item,
  remaining,
  onTap,
  onEdit,
  onDelete,
}: AdhkarItemCardProps) {
  const isDone = remaining <= 0;
  const [isPulsing, setIsPulsing] = useState(false);

  function handleTap() {
    if (isDone) return;
    setIsPulsing(true);
    onTap();
    setTimeout(() => setIsPulsing(false), 150);
  }

  return (
    <div className="w-full flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-3">
      <button
        type="button"
        onClick={handleTap}
        disabled={isDone}
        className="flex-1 text-right"
      >
        <span
          className={`text-sm ${isDone ? "line-through text-neutral-400" : "text-neutral-900"}`}
        >
          {item.text}
        </span>
      </button>

      {isDone ? (
        <span className="flex items-center gap-1 text-xs text-green-600 shrink-0">
          <i className="ti ti-check text-sm" aria-hidden="true" />
          خلصت
        </span>
      ) : (
        <button
          type="button"
          onClick={handleTap}
          className={`shrink-0 rounded-full w-9 h-9 flex items-center justify-center text-sm font-semibold transition-transform duration-150 ${
            isPulsing
              ? "scale-125 bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-900"
          }`}
        >
          {remaining}
        </button>
      )}

      <div className="flex gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onEdit}
          aria-label="تعديل"
          className="text-neutral-300 hover:text-neutral-600"
        >
          <SquarePen size={16} className="text-inherit" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="حذف"
          className="text-neutral-300 hover:text-red-500"
        >
          <Trash2 size={16} className="text-inherit" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
