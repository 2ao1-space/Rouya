"use client";

import { useState } from "react";
import { Plus, X, GripVertical } from "lucide-react";
import { Modal } from "@/components/finance/Modal";
import { NoteType } from "../types/notes";
import {
  useNoteCategories,
  useAddNoteCategory,
} from "../hooks/useNoteCategories";
import { useCreateNote, useUpdateNote } from "../hooks/useNotes";
import { DrawingPad } from "../components/DrawingPad";

const PRESET_COLORS = ["#3b82f6", "#16a34a", "#d97706", "#dc2626", "#7c3aed"];

interface NoteEditorModalProps {
  type: NoteType;
  onClose: () => void;
}

export function NoteEditorModal({ type, onClose }: NoteEditorModalProps) {
  const { data: categories = [] } = useNoteCategories();
  const addCategory = useAddNoteCategory();
  const createNote = useCreateNote();

  const [text, setText] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | Blob | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  // 🔧 عناصر التودو بتتبني محليًا الأول، وتتحفظ كلها مع النوت مرة واحدة عند الحفظ
  const [todoItems, setTodoItems] = useState<string[]>([]);
  const [newTodoText, setNewTodoText] = useState("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleAddCategory() {
    if (!newCategoryName.trim()) return;
    const color = PRESET_COLORS[categories.length % PRESET_COLORS.length];
    addCategory.mutate({ name: newCategoryName.trim(), color });
    setNewCategoryName("");
    setShowNewCategory(false);
  }

  function addTodoItem() {
    if (!newTodoText.trim()) return;
    setTodoItems((prev) => [...prev, newTodoText.trim()]);
    setNewTodoText("");
  }

  function removeTodoItem(index: number) {
    setTodoItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    await createNote.mutateAsync({
      type,
      categoryId,
      textContent: text.trim() || null,
      imageFile: imageFile ?? undefined,
      imageFileName:
        type === "drawing" ? "drawing.png" : (imageFile as File)?.name,
      todoItems: type === "todo" ? todoItems : undefined,
    });
    onClose();
  }

  return (
    <Modal title="نوت جديدة" onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        {type === "drawing" &&
          (imagePreview ? (
            <img
              src={imagePreview}
              alt="الرسمة"
              className="w-full rounded-lg border border-neutral-200"
            />
          ) : (
            <DrawingPad
              onSave={(blob) => {
                setImageFile(blob);
                setImagePreview(URL.createObjectURL(blob));
              }}
            />
          ))}

        {type === "image" &&
          (imagePreview ? (
            <img
              src={imagePreview}
              alt="معاينة"
              className="w-full rounded-lg border border-neutral-200"
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-xs"
            />
          ))}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            type === "todo" ? "عنوان القايمة (اختياري)" : "اكتب هنا..."
          }
          rows={type === "todo" ? 2 : 4}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        />

        {type === "todo" && (
          <div className="flex flex-col gap-1.5">
            {todoItems.map((itemText, index) => (
              <div key={index} className="flex items-center gap-2">
                <GripVertical size={13} className="text-neutral-300" />
                <span className="flex-1 text-sm">{itemText}</span>
                <button
                  type="button"
                  onClick={() => removeTodoItem(index)}
                  className="text-neutral-300 hover:text-red-500"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTodoItem())
                }
                placeholder="مهمة جديدة..."
                className="flex-1 rounded-lg border border-dashed border-neutral-300 px-3 py-1.5 text-xs"
              />
              <button
                type="button"
                onClick={addTodoItem}
                className="rounded-lg border border-neutral-200 px-2.5"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

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
            {categories.map(
              (cat: { id: string; name: string; color: string }) => (
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
              ),
            )}
            <button
              type="button"
              onClick={() => setShowNewCategory(true)}
              className="rounded-full border border-dashed border-neutral-300 px-3 py-1 text-xs text-neutral-500"
            >
              + جديدة
            </button>
          </div>

          {showNewCategory && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="اسم الفئة"
                className="flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs text-white"
              >
                حفظ
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={createNote.isPending}
          className="w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {createNote.isPending ? "بيحفظ..." : "حفظ"}
        </button>
      </div>
    </Modal>
  );
}
