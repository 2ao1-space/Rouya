"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Note, NoteType } from "./types/notes";
import { useNoteCategories } from "./hooks/useNoteCategories";
import {
  useNotes,
  useDeleteNote,
  useTogglePinNote,
  fetchNoteImageUrl,
} from "./hooks/useNotes";
import { NoteCard } from "./components/NoteCard";
import { NoteTypePickerModal } from "./components/NoteTypePickerModal";
import { NoteEditorModal } from "./components/NoteEditorModal";
import { NoteEditModal } from "./components/NoteEditModal";
import { NoteViewModal } from "./components/NoteViewModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";

export default function NotesPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const { data: categories = [] } = useNoteCategories();
  const { data: notes = [] } = useNotes(activeCategoryId);
  const deleteNote = useDeleteNote();
  const togglePin = useTogglePinNote();

  const [showTypePicker, setShowTypePicker] = useState(false);
  const [creatingType, setCreatingType] = useState<NoteType | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [viewingImageUrl, setViewingImageUrl] = useState<string | null>(null);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);

  useEffect(() => {
    let canceled = false;

    if (viewingNote?.imagePath) {
      fetchNoteImageUrl(viewingNote.imagePath).then((url) => {
        if (!canceled) setViewingImageUrl(url);
      });
    }

    return () => {
      canceled = true;
      setViewingImageUrl(null);
    };
  }, [viewingNote]);

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-lg px-4 py-6 pb-28 flex flex-col gap-4"
    >
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveCategoryId(null)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${activeCategoryId === null ? "bg-neutral-900 text-white" : "border border-neutral-200"}`}
        >
          الكل
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategoryId(cat.id)}
            style={{
              backgroundColor:
                activeCategoryId === cat.id ? cat.color : "transparent",
              borderColor: cat.color,
              color: activeCategoryId === cat.id ? "white" : cat.color,
            }}
            className="shrink-0 rounded-full px-3 py-1.5 text-xs border"
          >
            {cat.name}
          </button>
        ))}
      </div>

      {notes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-400">
          لسه مفيش نوتس
        </p>
      ) : (
        <div className="columns-2 gap-2.5">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              category={categories.find((c) => c.id === note.categoryId)}
              onView={() => setViewingNote(note)}
              onEdit={() => setEditingNote(note)}
              onDelete={() => setDeletingNote(note)}
              onTogglePin={() =>
                togglePin.mutate({ id: note.id, pinned: !note.pinned })
              }
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowTypePicker(true)}
        aria-label="نوت جديدة"
        style={{ width: 52, height: 52 }}
        className="fixed bottom-24 left-6 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-lg"
      >
        <Plus size={22} />
      </button>

      {showTypePicker && (
        <NoteTypePickerModal
          onClose={() => setShowTypePicker(false)}
          onSelect={(type) => {
            setShowTypePicker(false);
            setCreatingType(type);
          }}
        />
      )}

      {creatingType && (
        <NoteEditorModal
          type={creatingType}
          onClose={() => setCreatingType(null)}
        />
      )}

      {editingNote && (
        <NoteEditModal
          note={editingNote}
          onClose={() => setEditingNote(null)}
        />
      )}

      {viewingNote && (
        <NoteViewModal
          note={viewingNote}
          category={categories.find((c) => c.id === viewingNote.categoryId)}
          imageUrl={viewingImageUrl}
          onClose={() => setViewingNote(null)}
        />
      )}

      {deletingNote && (
        <DeleteConfirmModal
          message={`متأكد إنك عايز تحذف النوت دي؟ الخطوة دي مش هترجع.`}
          onClose={() => setDeletingNote(null)}
          onConfirm={() => deleteNote.mutate(deletingNote)}
        />
      )}
    </div>
  );
}
