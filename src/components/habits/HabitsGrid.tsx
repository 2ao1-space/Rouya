"use client";

import { useEffect, useRef } from "react";
import { Habit, Mood } from "@/types/habits";
import { getMoodEmoji } from "@/lib/habits";
import { Check, Pencil, Smile, Trash2 } from "lucide-react";

interface HabitsGridProps {
  habits: Habit[];
  monthDays: string[];
  todayKey: string;
  habitLogs: Record<string, boolean>;
  moodLogs: Record<string, Mood>;
  isEditMode: boolean;
  onToggleHabit: (habitId: string, current: boolean) => void;
  onOpenMoodPicker: () => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
}

export function HabitsGrid({
  habits,
  monthDays,
  todayKey,
  habitLogs,
  moodLogs,
  isEditMode,
  onToggleHabit,
  onOpenMoodPicker,
  onEditHabit,
  onDeleteHabit,
}: HabitsGridProps) {
  const todayIndex = monthDays.indexOf(todayKey);
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayColumnRef = useRef<HTMLTableCellElement>(null);

  // 🔧 لما الجدول يتحمل، اسكرول تلقائي لعمود النهاردة عشان يبان من غير ما تدور عليه
  useEffect(() => {
    if (todayColumnRef.current) {
      todayColumnRef.current.scrollIntoView({
        behavior: "auto",
        inline: "center",
        block: "nearest",
      });
    }
  }, [todayKey]);

  return (
    <div
      ref={scrollRef}
      className="overflow-x-auto rounded-xl border border-neutral-200"
    >
      <table className="border-collapse w-full min-w-[500px]">
        <thead>
          <tr>
            <th className="sticky right-0 bg-neutral-50 px-2.5 py-2 text-xs text-right min-w-[110px] z-10">
              اليوم
            </th>
            {monthDays.map((day, index) => (
              <th
                key={day}
                ref={index === todayIndex ? todayColumnRef : undefined}
                className={`px-1 py-2 text-[10px] min-w-[28px] ${
                  index === todayIndex
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-neutral-400"
                } ${index > todayIndex ? "opacity-30" : ""}`}
              >
                {Number(day.split("-")[2])}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-neutral-100 bg-neutral-50/60">
            <td className="sticky right-0 bg-neutral-50 px-2.5 py-2 text-xs z-10">
              <span className="flex items-center gap-1.5">
                <Smile size={14} />
                مزاجك
              </span>
            </td>
            {monthDays.map((day, index) => {
              const isToday = day === todayKey;
              const isFuture = index > todayIndex;
              return (
                <td
                  key={day}
                  className={`text-center text-sm ${isToday ? "bg-blue-50" : ""} ${isFuture ? "opacity-20" : ""}`}
                >
                  {isFuture ? (
                    "—"
                  ) : isToday ? (
                    <button
                      type="button"
                      onClick={onOpenMoodPicker}
                      className="text-base"
                    >
                      {getMoodEmoji(moodLogs[day]) || "＋"}
                    </button>
                  ) : (
                    getMoodEmoji(moodLogs[day]) || "—"
                  )}
                </td>
              );
            })}
          </tr>

          {habits.map((habit) => (
            <tr key={habit.id} className="border-t border-neutral-100">
              <td className="sticky right-0 bg-white px-2.5 py-2 text-xs z-10">
                <div className="flex items-center justify-between gap-1.5">
                  <span>{habit.name}</span>
                  {isEditMode && (
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onEditHabit(habit)}
                        aria-label="تعديل"
                        className="text-neutral-400 hover:text-neutral-700"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteHabit(habit.id)}
                        aria-label="حذف"
                        className="text-neutral-400 hover:text-red-600"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </td>
              {monthDays.map((day, index) => {
                const isToday = day === todayKey;
                const isFuture = index > todayIndex;
                const done = habitLogs[`${habit.id}:${day}`] ?? false;

                return (
                  <td
                    key={day}
                    className={`text-center ${isToday ? "bg-blue-50" : ""} ${isFuture ? "opacity-20" : ""}`}
                  >
                    {isFuture ? (
                      "—"
                    ) : isToday ? (
                      <button
                        type="button"
                        onClick={() => onToggleHabit(habit.id, done)}
                        className="inline-flex"
                      >
                        {done ? (
                          <Check size={16} className="text-green-600" />
                        ) : (
                          <span className="inline-block w-4 h-4 rounded border-2 border-blue-300" />
                        )}
                      </button>
                    ) : done ? (
                      <Check size={16} className="text-green-600 inline" />
                    ) : (
                      <span className="text-neutral-300 text-xs">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
