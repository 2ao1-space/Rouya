"use client";

import { useEffect, useState } from "react";
import { AdhkarCategory, AdhkarItem } from "@/types/adhkar";
import { toDateKey } from "@/lib/prayer";
import {
  useAdhkarItems,
  useAdhkarProgress,
  useTapAdhkar,
  useAddAdhkarItem,
  useSeedDefaultAdhkar,
  useDeleteAdhkarItem,
  useEditAdhkarItem,
} from "@/hooks/useAdhkar";
import { useQuranDay, useSetQuranPages } from "@/hooks/useQuran";
import { AdhkarItemCard } from "@/components/adhkar/AdhkarItemCard";
import { AddAdhkarModal } from "@/components/adhkar/AddAdhkarModal";
import { DuasList } from "@/components/adhkar/DuasList";
import { QuranCard } from "@/components/adhkar/QuranCard";

type Tab = AdhkarCategory | "duas";

// 🔧 تحديد بسيط: قبل الظهر = صباح، بعده = مساء. لاحقًا نقدر نربطها بمواقيت الصلاة الفعلية بدل الساعة
function getDefaultTab(): Tab {
  return new Date().getHours() < 12 ? "morning" : "evening";
}

export default function AdhkarPage() {
  const [tab, setTab] = useState<Tab>(getDefaultTab());
  const [showAddModal, setShowAddModal] = useState(false);
  const dateKey = toDateKey(new Date());

  const seedDefaults = useSeedDefaultAdhkar();
  useEffect(() => {
    seedDefaults.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeCategory: AdhkarCategory = tab === "duas" ? "morning" : tab;
  const { data: items = [] } = useAdhkarItems(activeCategory);
  const itemIds = items.map((i) => i.id);
  const { data: progress = {} } = useAdhkarProgress(dateKey, itemIds);
  const tapAdhkar = useTapAdhkar(dateKey);
  const addAdhkarItem = useAddAdhkarItem();

  // أضف state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<AdhkarItem | null>(null);
  const editAdhkarItem = useEditAdhkarItem(activeCategory);
  const deleteAdhkarItem = useDeleteAdhkarItem(activeCategory);

  // رتّب العناصر: اللي مخلّص ينزل آخر القائمة
  const sortedItems = [...items].sort((a, b) => {
    const aDone = (progress[a.id] ?? a.targetCount) <= 0;
    const bDone = (progress[b.id] ?? b.targetCount) <= 0;
    if (aDone !== bDone) return aDone ? 1 : -1;
    return a.order - b.order;
  });

  const { data: quranPages = 0 } = useQuranDay(dateKey);
  const setQuranPages = useSetQuranPages(dateKey);

  const completedCount = items.filter(
    (i) => (progress[i.id] ?? i.targetCount) <= 0,
  ).length;

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-lg px-4 py-6 pb-24 flex flex-col gap-5"
    >
      <div className="mb-8">
        <p className="text-sm text-neutral-500 mb-2">القرآن</p>
        <QuranCard
          pages={quranPages}
          onAdd={(amount, unit) => {
            const pagesToAdd =
              amount * (unit === "page" ? 1 : unit === "quarter" ? 5 : 20);
            setQuranPages.mutate(quranPages + pagesToAdd);
          }}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("morning")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm ${
            tab === "morning"
              ? "bg-neutral-900 text-white"
              : "border border-neutral-200 text-neutral-700"
          }`}
        >
          <i className="ti ti-sun text-sm" aria-hidden="true" />
          أذكار الصباح
        </button>
        <button
          type="button"
          onClick={() => setTab("evening")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm ${
            tab === "evening"
              ? "bg-neutral-900 text-white"
              : "border border-neutral-200 text-neutral-700"
          }`}
        >
          <i className="ti ti-moon text-sm" aria-hidden="true" />
          أذكار المساء
        </button>
        <button
          type="button"
          onClick={() => setTab("duas")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm ${
            tab === "duas"
              ? "bg-neutral-900 text-white"
              : "border border-neutral-200 text-neutral-700"
          }`}
        >
          <i className="ti ti-heart text-sm" aria-hidden="true" />
          أدعيتي
        </button>
      </div>

      {tab !== "duas" && (
        <>
          {/* // زرار التحكم فوق القائمة (ضيفه فوق الـ progress bar) */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              تقدمك في {tab === "morning" ? "أذكار الصباح" : "أذكار المساء"}
            </span>
            <button
              type="button"
              onClick={() => setIsEditMode((v) => !v)}
              className={`text-xs rounded-lg px-3 py-1 ${isEditMode ? "bg-neutral-900 text-white" : "border border-neutral-200"}`}
            >
              {isEditMode ? "تم" : "تعديل"}
            </button>
          </div>
          <div className="rounded-xl bg-neutral-50 px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              تقدمك في {tab === "morning" ? "أذكار الصباح" : "أذكار المساء"}
            </span>
            <span className="text-sm font-medium">
              {completedCount} / {items.length} مكتملة
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-neutral-300 py-2.5 text-xs text-neutral-500"
            >
              <i className="ti ti-plus text-sm" aria-hidden="true" />
              إضافة ذكر جديد
            </button>
            {sortedItems.map((item) => (
              <AdhkarItemCard
                key={item.id}
                item={item}
                remaining={progress[item.id] ?? item.targetCount}
                onTap={() => tapAdhkar.mutate(item.id)}
                onEdit={() => setEditingItem(item)}
                onDelete={() => deleteAdhkarItem.mutate(item.id)}
              />
            ))}
          </div>
        </>
      )}

      {tab === "duas" && <DuasList />}

      {showAddModal && (
        <AddAdhkarModal
          category={activeCategory}
          onClose={() => setShowAddModal(false)}
          onSubmit={(data) =>
            addAdhkarItem.mutate({ category: activeCategory, ...data })
          }
        />
      )}

      {editingItem && (
        <AddAdhkarModal
          category={activeCategory}
          initial={{
            text: editingItem.text,
            targetCount: editingItem.targetCount,
          }}
          onClose={() => setEditingItem(null)}
          onSubmit={(data) =>
            editAdhkarItem.mutate({ itemId: editingItem.id, ...data })
          }
        />
      )}
    </div>
  );
}
