"use client";

import { Note, NoteCategory } from "../types/notes";
import { useTodoItems, useToggleTodoItem } from "../hooks/useTodoItems";
import { CheckSquare, Square } from "lucide-react";

export function NoteViewModal({
  note,
  category,
  imageUrl,
  onClose,
}: {
  note: Note;
  category: NoteCategory | undefined;
  imageUrl: string | null;
  onClose: () => void;
}) {
  const { data: todoItems = [] } = useTodoItems(
    note.type === "todo" ? note.id : "",
  );
  const toggleItem = useToggleTodoItem(note.id);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[85vh] bg-white rounded-2xl overflow-y-auto p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {category && (
          <p className="text-xs mb-2" style={{ color: category.color }}>
            {category.name}
          </p>
        )}
        {imageUrl && (
          <img src={imageUrl} alt="" className="w-full rounded-lg mb-3" />
        )}

        {note.type === "todo" ? (
          <div className="flex flex-col gap-2">
            {todoItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  toggleItem.mutate({ itemId: item.id, done: !item.done })
                }
                className="flex items-center gap-2 w-full text-right"
              >
                {item.done ? (
                  <CheckSquare size={16} className="text-green-600 shrink-0" />
                ) : (
                  <Square size={16} className="text-neutral-300 shrink-0" />
                )}
                <span
                  className={`text-sm ${item.done ? "line-through text-neutral-400" : ""}`}
                >
                  {item.text}
                </span>
              </button>
            ))}
          </div>
        ) : (
          note.textContent && (
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {note.textContent}
            </p>
          )
        )}
      </div>
    </div>
  );
}
