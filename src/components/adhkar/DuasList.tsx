"use client";

import { useState } from "react";
import {
  useDuas,
  useAddDua,
  useEditDua,
  useDeleteDua,
  useTogglePinDua,
  useDuaCategories,
  useAddDuaCategory,
} from "@/hooks/useDuas";

// 🔧 ألوان جاهزة يختار منها المستخدم لما يعمل فئة جديدة
const PRESET_COLORS = [
  "#3b82f6",
  "#16a34a",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

export function DuasList() {
  const { data: categories = [] } = useDuaCategories();
  const addCategory = useAddDuaCategory();

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const { data: duas = [] } = useDuas(activeCategoryId);
  const addDua = useAddDua();
  const editDua = useEditDua();
  const deleteDua = useDeleteDua();
  const togglePin = useTogglePinDua();

  const [newDua, setNewDua] = useState("");
  const [newDuaCategory, setNewDuaCategory] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  function handleAdd() {
    if (!newDua.trim()) return;
    addDua.mutate({ text: newDua.trim(), categoryId: newDuaCategory });
    setNewDua("");
  }

  function handleAddCategory() {
    if (!newCategoryName.trim()) return;
    const color = PRESET_COLORS[categories.length % PRESET_COLORS.length];
    addCategory.mutate({ name: newCategoryName.trim(), color });
    setNewCategoryName("");
    setShowNewCategoryInput(false);
  }

  function getCategoryColor(categoryId: string | null) {
    return categories.find((c) => c.id === categoryId)?.color ?? "#9ca3af";
  }

  return (
    <div className="flex flex-col gap-4">
      {/* فلتر الفئات */}
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveCategoryId(null)}
          className={`rounded-full px-3 py-1 text-xs border ${
            activeCategoryId === null
              ? "bg-neutral-900 text-white border-neutral-900"
              : "border-neutral-200"
          }`}
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
            className="rounded-full px-3 py-1 text-xs border"
          >
            {cat.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowNewCategoryInput(true)}
          className="rounded-full border border-dashed border-neutral-300 px-3 py-1 text-xs text-neutral-500"
        >
          + فئة جديدة
        </button>
      </div>

      {showNewCategoryInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="اسم الفئة (مثال: الرزق)"
            className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white"
          >
            حفظ
          </button>
        </div>
      )}

      {/* إضافة دعاء */}
      <div className="flex flex-col gap-2">
        <textarea
          value={newDua}
          onChange={(e) => setNewDua(e.target.value)}
          placeholder="اكتب دعاء جديد..."
          rows={2}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <select
            value={newDuaCategory ?? ""}
            onChange={(e) => setNewDuaCategory(e.target.value || null)}
            className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          >
            <option value="">بدون فئة</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white"
          >
            إضافة
          </button>
        </div>
      </div>

      {/* القائمة */}
      {duas.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-400">
          لسه مفيش أدعية محفوظة
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {duas.map((dua) => (
            <div
              key={dua.id}
              className="rounded-xl border border-neutral-200 px-4 py-3"
            >
              {editingId === dua.id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        editDua.mutate({
                          id: dua.id,
                          text: editingText,
                          categoryId: dua.categoryId,
                        });
                        setEditingId(null);
                      }}
                      className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs text-white"
                    >
                      حفظ
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    {dua.categoryId && (
                      <span
                        className="inline-block rounded-full px-2 py-0.5 text-[10px] mb-1.5"
                        style={{
                          backgroundColor: `${getCategoryColor(dua.categoryId)}20`,
                          color: getCategoryColor(dua.categoryId),
                        }}
                      >
                        {categories.find((c) => c.id === dua.categoryId)?.name}
                      </span>
                    )}
                    <p className="text-sm text-neutral-900">{dua.text}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        togglePin.mutate({ id: dua.id, pinned: !dua.pinned })
                      }
                      aria-label={dua.pinned ? "إلغاء التثبيت" : "تثبيت"}
                      className={
                        dua.pinned
                          ? "text-amber-500"
                          : "text-neutral-400 hover:text-amber-500"
                      }
                    >
                      <i className="ti ti-pin text-sm" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(dua.id);
                        setEditingText(dua.text);
                      }}
                      aria-label="تعديل"
                      className="text-neutral-400 hover:text-neutral-700"
                    >
                      <i className="ti ti-pencil text-sm" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteDua.mutate(dua.id)}
                      aria-label="حذف"
                      className="text-neutral-400 hover:text-red-600"
                    >
                      <i className="ti ti-trash text-sm" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
