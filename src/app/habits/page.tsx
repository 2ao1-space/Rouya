"use client";

import { useState } from "react";
import { toDateKey, daysInMonth } from "@/lib/habits";
import { Habit, Mood } from "@/types/habits";
import {
  useHabits,
  useAddHabit,
  useEditHabit,
  useDeleteHabit,
  useHabitMonthLogs,
  useToggleHabitToday,
} from "@/hooks/useHabits";
import { useMoodMonthLogs, useSetMoodToday } from "@/hooks/useMood";
import { DailyTasksCard } from "@/components/habits/DailyTasksCard";
import { HabitsGrid } from "@/components/habits/HabitsGrid";
import { HabitBadgeList } from "@/components/habits/HabitBadgeList";
import { AddHabitModal } from "@/components/habits/AddHabitModal";
import { MoodPickerModal } from "@/components/habits/MoodPickerModal";
import { MonthlyReportModal } from "@/components/habits/MonthlyReportModal";

export default function HabitsPage() {
  const now = new Date();
  const todayKey = toDateKey(now);
  const year = now.getFullYear();
  const month = now.getMonth();
  const totalDays = daysInMonth(year, month);
  const monthDays = Array.from({ length: totalDays }, (_, i) =>
    toDateKey(new Date(year, month, i + 1)),
  );
  const todayIndex = monthDays.indexOf(todayKey);

  const monthStart = monthDays[0];
  const monthEnd = monthDays[monthDays.length - 1];

  const { data: habits = [] } = useHabits();
  const addHabit = useAddHabit();
  const editHabit = useEditHabit();
  const deleteHabit = useDeleteHabit();
  const { data: habitLogs = {} } = useHabitMonthLogs(monthStart, monthEnd);
  const toggleHabit = useToggleHabitToday();

  const { data: moodLogs = {} } = useMoodMonthLogs(monthStart, monthEnd);
  const setMood = useSetMoodToday();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [renamingHabit, setRenamingHabit] = useState<Habit | null>(null);
  const [showEditHabits, setShowEditHabits] = useState(false);
  const [showMonthlyReport, setShowMonthlyReport] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-lg px-4 py-6 pb-24 flex flex-col gap-6"
    >
      <DailyTasksCard />
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-neutral-500">
            الجدول الشهري (اتحرك يمين شمال)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowAddHabit(true)}
              aria-label="إضافة عادة"
              className="rounded-lg border border-neutral-200 px-2.5 py-1"
            >
              <i className="ti ti-plus text-xs" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setIsEditMode((v) => !v)}
              className={`rounded-lg px-3 py-1 text-xs ${isEditMode ? "bg-neutral-900 text-white" : "border border-neutral-200"}`}
            >
              {isEditMode ? "تم" : "تعديل"}
            </button>
          </div>
        </div>

        <HabitsGrid
          habits={habits}
          monthDays={monthDays}
          todayKey={todayKey}
          habitLogs={habitLogs}
          moodLogs={moodLogs}
          isEditMode={isEditMode}
          onToggleHabit={(habitId, current) =>
            toggleHabit.mutate({ habitId, done: !current })
          }
          onOpenMoodPicker={() => setShowMoodPicker(true)}
          onEditHabit={(habit) => setRenamingHabit(habit)}
          onDeleteHabit={(id) => {
            if (window.confirm("متأكد إنك عايز تشيل العادة دي؟"))
              deleteHabit.mutate(id);
          }}
        />
      </div>
      <div>
        <p className="text-sm text-neutral-500 mb-2">تقييم العادات هذا الشهر</p>
        <HabitBadgeList
          habits={habits}
          habitLogs={habitLogs}
          monthDays={monthDays}
          todayIndex={todayIndex}
        />
      </div>
      <button
        type="button"
        onClick={() => setShowMonthlyReport(true)}
        className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm text-white"
      >
        <i className="ti ti-report text-sm" aria-hidden="true" />
        تقرير الشهر اللي فات
      </button>
      {showMonthlyReport && (
        <MonthlyReportModal onClose={() => setShowMonthlyReport(false)} />
      )}

      {showAddHabit && (
        <AddHabitModal
          onClose={() => setShowAddHabit(false)}
          onSubmit={(name) => addHabit.mutate(name)}
        />
      )}
      {renamingHabit && (
        <AddHabitModal
          title="تعديل اسم العادة"
          initial={renamingHabit.name}
          onClose={() => setRenamingHabit(null)}
          onSubmit={(name) =>
            editHabit.mutate({ habitId: renamingHabit.id, name })
          }
        />
      )}
      {showMoodPicker && (
        <MoodPickerModal
          onClose={() => setShowMoodPicker(false)}
          onSelect={(mood: Mood) => setMood.mutate(mood)}
        />
      )}
    </div>
  );
}
