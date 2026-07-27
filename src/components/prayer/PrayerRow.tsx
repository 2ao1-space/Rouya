"use client";

import { PrayerName, PrayerStatus } from "@/types/prayer";
import { PRAYER_ORDER, PRAYER_LABELS, NAWAFIL_CONFIG } from "@/lib/prayer";
import { NawafilCheckboxes } from "@/components/prayer/NawafilCheckboxes";
import { PrayerTimings } from "@/lib/prayerTimesApi";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";

interface PrayerRowProps {
  statuses: Record<PrayerName, PrayerStatus>;
  nawafilBefore: Record<PrayerName, number>;
  nawafilAfter: Record<PrayerName, number>;
  prayerTimes?: PrayerTimings;
  onCyclePrayer: (prayer: PrayerName, current: PrayerStatus) => void;
  onChangeNawafilBefore: (prayer: PrayerName, rakats: number) => void;
  onChangeNawafilAfter: (prayer: PrayerName, rakats: number) => void;
}

export function PrayerRow({
  statuses,
  nawafilBefore,
  nawafilAfter,
  onCyclePrayer,
  onChangeNawafilBefore,
  onChangeNawafilAfter,
}: PrayerRowProps) {
  const { data: prayerTimes } = usePrayerTimes(prayerTimes);

  return (
    <div className="grid grid-cols-5 gap-1.5 rounded-xl border border-neutral-200 px-1.5 py-2.5">
      {PRAYER_ORDER.map((prayer) => {
        const status = statuses[prayer];
        const config = NAWAFIL_CONFIG[prayer];
        const isPrayed = status === "prayed";
        const isMissed = status === "missed";

        return (
          <div key={prayer} className="flex flex-col items-center gap-1.5">
            <NawafilCheckboxes
              rakats={nawafilBefore[prayer]}
              totalRakats={config.before}
              onChange={(r) => onChangeNawafilBefore(prayer, r)}
            />

            <span className="text-xs text-neutral-700">
              {PRAYER_LABELS[prayer]}
            </span>
            {prayerTimes && (
              <span className="text-[9px] text-neutral-400">
                {prayerTimes[prayer]}
              </span>
            )}

            <button
              type="button"
              onClick={() => onCyclePrayer(prayer, status)}
              aria-label={PRAYER_LABELS[prayer]}
              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-colors ${
                isPrayed
                  ? "border-green-600 bg-green-50"
                  : isMissed
                    ? "border-red-500 bg-red-50"
                    : "border-neutral-300"
              }`}
            >
              {isPrayed && (
                <i
                  className="ti ti-check text-lg text-green-700"
                  aria-hidden="true"
                />
              )}
              {isMissed && (
                <i
                  className="ti ti-x text-lg text-red-600"
                  aria-hidden="true"
                />
              )}
            </button>

            <NawafilCheckboxes
              rakats={nawafilAfter[prayer]}
              totalRakats={config.after}
              onChange={(r) => onChangeNawafilAfter(prayer, r)}
            />
          </div>
        );
      })}
    </div>
  );
}
