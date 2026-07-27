"use client";

import { DayTier } from "@/hooks/usePrayerMonthDetailed";
import { toDateKey } from "@/lib/prayer";

interface PrayerCalendarProps {
  monthDate: Date;
  tiersByDate: Record<string, DayTier>;
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
}

const tierStyles: Record<DayTier | "future", string> = {
  complete: "bg-blue-600 text-white",
  fardOnly: "bg-green-600 text-white",
  partial: "bg-amber-100 text-amber-800",
  missed: "bg-red-100 text-red-700",
  empty: "bg-neutral-50 text-neutral-400",
  future: "bg-transparent text-neutral-300",
};

export function PrayerCalendar({
  monthDate,
  tiersByDate,
  selectedDateKey,
  onSelectDate,
}: PrayerCalendarProps) {
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
                isSelected ? "ring-2 ring-neutral-900" : ""
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-2.5 text-xs text-neutral-400">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" /> كل حاجة
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-green-600" /> الفروض بس
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-100" /> ناقص
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-100" /> فاتت
        </span>
      </div>
    </div>
  );
}
