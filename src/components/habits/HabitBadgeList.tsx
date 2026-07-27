"use client";

import { Habit } from "@/types/habits";
import { getHabitBadge } from "@/lib/habits";

interface HabitBadgeListProps {
  habits: Habit[];
  habitLogs: Record<string, boolean>;
  monthDays: string[];
  todayIndex: number;
}

export function HabitBadgeList({
  habits,
  habitLogs,
  monthDays,
  todayIndex,
}: HabitBadgeListProps) {
  const daysSoFar = todayIndex + 1;

  return (
    <div className="flex flex-col gap-2">
      {habits.map((habit) => {
        const doneDays = monthDays
          .slice(0, daysSoFar)
          .filter((day) => habitLogs[`${habit.id}:${day}`]).length;
        const badge = getHabitBadge(doneDays, monthDays.length);
        const percent = (doneDays / monthDays.length) * 100;

        return (
          <div
            key={habit.id}
            className="rounded-lg border border-neutral-200 p-3"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm flex items-center gap-2">
                {habit.name}
                {badge && (
                  <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full">
                    {badge.emoji} {badge.label}
                  </span>
                )}
              </span>
              <span className="text-xs text-neutral-400">
                {doneDays} / {monthDays.length} يوم
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="h-full bg-green-600"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
