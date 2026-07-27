"use client";

import { useState } from "react";
import { Modal } from "@/components/finance/Modal";
import { Note } from "../types/notes";
import { useNoteCategories } from "../hooks/useNoteCategories";
import { useUpdateNote } from "../hooks/useNotes";
import { TodoItemsEditor } from "../components/TodoItemsEditor";

export function NoteEditModal({
  note,
  onClose,
}: {
  note: Note;
  onClose: () => void;
}) {
  const { data: categories = [] } = useNoteCategories();
  const updateNote = useUpdateNote();

  const [text, setText] = useState(note.textContent ?? "");
  const [categoryId, setCategoryId] = useState<string | null>(note.categoryId);

  function handleSave() {
    updateNote.mutate({
      id: note.id,
      textContent: text.trim() || null,
      categoryId,
    });
    onClose();
  }

  return (
    <Modal title="تعديل النوت" onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        />

        {note.type === "todo" && <TodoItemsEditor noteId={note.id} />}

        <div>
          <p className="text-xs text-neutral-500 mb-1.5">الفئة</p>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setCategoryId(null)}
              className={`rounded-full px-3 py-1 text-xs border ${categoryId === null ? "bg-neutral-900 text-white" : "border-neutral-200"}`}
            >
              بدون
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                style={{
                  backgroundColor:
                    categoryId === cat.id ? cat.color : "transparent",
                  borderColor: cat.color,
                  color: categoryId === cat.id ? "white" : cat.color,
                }}
                className="rounded-full px-3 py-1 text-xs border"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={updateNote.isPending}
          className="w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {updateNote.isPending ? "بيحفظ..." : "حفظ التعديل"}
        </button>
      </div>
    </Modal>
  );
}
