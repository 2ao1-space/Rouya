"use client";

import { useEffect, useState } from "react";
import { Pin, PinOff, Pencil, Trash2, Square, CheckSquare } from "lucide-react";
import { Note, NoteCategory } from "../types/notes";
import { fetchNoteImageUrl } from "../hooks/useNotes";
import { useTodoItems } from "../hooks/useTodoItems";

interface NoteCardProps {
  note: Note;
  category: NoteCategory | undefined;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}

export function NoteCard({
  note,
  category,
  onView,
  onEdit,
  onDelete,
  onTogglePin,
}: NoteCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { data: todoItems = [] } = useTodoItems(
    note.type === "todo" ? note.id : "",
  );

  useEffect(() => {
    if (note.imagePath) fetchNoteImageUrl(note.imagePath).then(setImageUrl);
  }, [note.imagePath]);

  return (
    <div
      className="break-inside-avoid mb-2.5 rounded-2xl border border-neutral-200 bg-white p-3.5 relative"
      style={
        category ? { borderRight: `4px solid ${category.color}` } : undefined
      }
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin();
        }}
        className="absolute top-2 left-2 text-neutral-300 hover:text-amber-500 z-10"
      >
        {note.pinned ? (
          <Pin size={14} className="fill-amber-500 text-amber-500" />
        ) : (
          <PinOff size={14} />
        )}
      </button>

      <div onClick={onView} className="cursor-pointer">
        {category && (
          <p className="text-[10px] mb-1.5" style={{ color: category.color }}>
            {category.name}
          </p>
        )}
        {imageUrl && (
          <img
            src={imageUrl}
            alt=""
            className="w-full rounded-lg mb-2 object-cover max-h-40"
          />
        )}

        {note.type === "todo" ? (
          <div className="flex flex-col gap-1">
            {todoItems.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center gap-1.5">
                {item.done ? (
                  <CheckSquare size={13} className="text-green-600" />
                ) : (
                  <Square size={13} className="text-neutral-300" />
                )}
                <span
                  className={`text-xs ${item.done ? "line-through text-neutral-400" : ""}`}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        ) : (
          note.textContent && (
            <p className="text-sm text-neutral-900 whitespace-pre-wrap line-clamp-6">
              {note.textContent}
            </p>
          )
        )}
      </div>

      <div className="flex gap-2.5 mt-2.5 pt-2 border-t border-neutral-100">
        <button
          type="button"
          onClick={onEdit}
          className="text-neutral-400 hover:text-neutral-700"
        >
          <Pencil size={13} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="text-neutral-400 hover:text-red-600"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
