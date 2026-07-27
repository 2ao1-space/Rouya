"use client";

import { useState } from "react";
import { Habit } from "@/types/habits";
import { Modal } from "@/components/finance/Modal";

interface EditHabitsModalProps {
  habits: Habit[];
  onClose: () => void;
  onAdd: (name: string) => void;
  onRename: (habitId: string, name: string) => void;
  onDelete: (habitId: string) => void;
}

export function EditHabitsModal({
  habits,
  onClose,
  onAdd,
  onRename,
  onDelete,
}: EditHabitsModalProps) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  return (
    <Modal title="تعديل العادات" onClose={onClose}>
      <div className="flex flex-col gap-2">
        {habits.map((habit) => (
          <div key={habit.id} className="flex items-center gap-2">
            {editingId === habit.id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    onRename(habit.id, editingText.trim());
                    setEditingId(null);
                  }}
                  className="text-xs text-green-600"
                >
                  حفظ
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm">{habit.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(habit.id);
                    setEditingText(habit.name);
                  }}
                  aria-label="تعديل"
                  className="text-neutral-400 hover:text-neutral-700"
                >
                  <i className="ti ti-pencil text-sm" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`متأكد إنك عايز تشيل "${habit.name}"؟`))
                      onDelete(habit.id);
                  }}
                  aria-label="حذف"
                  className="text-neutral-400 hover:text-red-600"
                >
                  <i className="ti ti-trash text-sm" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        ))}

        <div className="flex gap-2 mt-2 pt-2 border-t border-neutral-100">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="عادة جديدة..."
            className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => {
              if (!newName.trim()) return;
              onAdd(newName.trim());
              setNewName("");
            }}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white"
          >
            إضافة
          </button>
        </div>
      </div>
    </Modal>
  );
}
