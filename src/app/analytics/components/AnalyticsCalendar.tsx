"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { DayTier } from "../hooks/useAnalyticsMonthTiers";
import { toDateKey } from "@/lib/habits";

interface AnalyticsCalendarProps {
  monthDate: Date;
  tiersByDate: Record<string, DayTier>;
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
  onChangeMonth: (delta: number) => void;
}

const tierStyles: Record<DayTier | "future" | "selected", string> = {
  complete: "bg-neutral-900 text-white",
  partial: "bg-amber-100 text-amber-800",
  missed: "bg-red-100 text-red-700",
  empty: "bg-neutral-50 text-neutral-400",
  future: "bg-transparent text-neutral-300",
  selected: "ring-2 ring-neutral-900",
};

export function AnalyticsCalendar({
  monthDate,
  tiersByDate,
  selectedDateKey,
  onSelectDate,
  onChangeMonth,
}: AnalyticsCalendarProps) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => onChangeMonth(-1)}
          aria-label="الشهر اللي فات"
        >
          <ChevronRight size={16} />
        </button>
        <p className="text-sm text-neutral-500">
          {monthDate.toLocaleDateString("ar-EG", {
            month: "long",
            year: "numeric",
          })}
        </p>
        <button
          type="button"
          onClick={() => onChangeMonth(1)}
          aria-label="الشهر الجاي"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} />;

          const cellDate = new Date(year, month, day);
          const dateKey = toDateKey(cellDate);
          const isFuture = cellDate > today;
          const tier = isFuture ? "future" : (tiersByDate[dateKey] ?? "empty");
          const isSelected = dateKey === selectedDateKey;

          return (
            <button
              key={dateKey}
              type="button"
              disabled={isFuture}
              onClick={() => onSelectDate(dateKey)}
              className={`aspect-square rounded-lg text-xs flex items-center justify-center ${tierStyles[tier]} ${
                isSelected ? tierStyles.selected : ""
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
