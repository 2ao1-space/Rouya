// app/prayer/page.tsx
"use client";

import { useState } from "react";
import { toDateKey } from "@/lib/prayer";
import {
  usePrayerDay,
  useSetPrayerStatus,
  nextStatus,
} from "@/hooks/usePrayer";
import { useNawafilDay, useSetNawafil } from "@/hooks/useNawafil";
import { useQiyamDay, useSetQiyam } from "@/hooks/useQiyam";
import { usePrayerMonthDetailed } from "@/hooks/usePrayerMonthDetailed";
import { PrayerRow } from "@/components/prayer/PrayerRow";
import { QiyamCard } from "@/components/prayer/QiyamCard";
import { PrayerCalendar } from "@/components/prayer/PrayerCalendar";
import { formatDate } from "@/lib/format";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";

export default function PrayerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthDate, setMonthDate] = useState(new Date());
  const dateKey = toDateKey(selectedDate);

  const monthStart = toDateKey(
    new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
  );
  const monthEnd = toDateKey(
    new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0),
  );

  const { data: prayerTimes } = usePrayerTimes(selectedDate);

  const { data: statuses } = usePrayerDay(dateKey);
  const setPrayerStatus = useSetPrayerStatus(dateKey);

  const { data: nawafil } = useNawafilDay(dateKey);
  const setNawafil = useSetNawafil(dateKey);

  const { data: qiyam } = useQiyamDay(dateKey);
  const setQiyam = useSetQiyam(dateKey);

  const { data: tiersByDate = {} } = usePrayerMonthDetailed(
    monthStart,
    monthEnd,
  );

  const isToday = dateKey === toDateKey(new Date());
  const prayedToday = statuses
    ? Object.values(statuses).filter((s) => s === "prayed").length
    : 0;

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-lg px-4 py-6 pb-24 flex flex-col gap-5"
    >
      <div className="border-t border-neutral-200 pt-5 flex flex-col gap-5">
        <div className="rounded-xl bg-neutral-50 p-4">
          <p className="text-xs text-neutral-500 mb-1">
            {isToday ? "صليت النهاردة" : formatDate(dateKey)}
          </p>
          <p className="text-xl font-medium">{prayedToday} / 5</p>
        </div>

        {statuses && nawafil && (
          <PrayerRow
            statuses={statuses}
            nawafilBefore={nawafil.before}
            nawafilAfter={nawafil.after}
            onCyclePrayer={(prayer, current) =>
              setPrayerStatus.mutate({ prayer, status: nextStatus[current] })
            }
            onChangeNawafilBefore={(prayer, rakats) =>
              setNawafil.mutate({
                prayer,
                phase: "before",
                rakatsPrayed: rakats,
              })
            }
            onChangeNawafilAfter={(prayer, rakats) =>
              setNawafil.mutate({
                prayer,
                phase: "after",
                rakatsPrayed: rakats,
              })
            }
          />
        )}

        {qiyam && (
          <QiyamCard data={qiyam} onChange={(data) => setQiyam.mutate(data)} />
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() =>
              setMonthDate(
                new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1),
              )
            }
          >
            <i className="ti ti-chevron-right" aria-hidden="true" />
          </button>
          <p className="text-sm text-neutral-500">
            {monthDate.toLocaleDateString("ar-EG", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <button
            type="button"
            onClick={() =>
              setMonthDate(
                new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1),
              )
            }
          >
            <i className="ti ti-chevron-left" aria-hidden="true" />
          </button>
        </div>
        <PrayerCalendar
          monthDate={monthDate}
          tiersByDate={tiersByDate}
          selectedDateKey={dateKey}
          onSelectDate={(key) => setSelectedDate(new Date(key))}
        />
      </div>
    </div>
  );
}
