"use client";

import { PrayerName } from "@/types/prayer";
import { PRAYER_ORDER, PRAYER_LABELS, NAWAFIL_CONFIG } from "@/lib/prayer";

interface NawafilCardProps {
  rakatsByPrayer: Record<PrayerName, number>;
  onChange: (prayer: PrayerName, rakats: number) => void;
}

export function NawafilCard({ rakatsByPrayer, onChange }: NawafilCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden">
      {PRAYER_ORDER.map((prayer, index) => {
        const config = NAWAFIL_CONFIG[prayer];
        const total = config.before + config.after;
        if (total === 0) return null;

        const current = rakatsByPrayer[prayer];
        return (
          <div
            key={prayer}
            className={`flex items-center justify-between px-4 py-3 ${
              index !== PRAYER_ORDER.length - 1
                ? "border-b border-neutral-100"
                : ""
            }`}
          >
            <div>
              <p className="text-sm text-neutral-900">
                {PRAYER_LABELS[prayer]}
              </p>
              <p className="text-xs text-neutral-400">
                {config.before > 0 && `${config.before} قبل`}
                {config.before > 0 && config.after > 0 && " · "}
                {config.after > 0 && `${config.after} بعد`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChange(prayer, Math.max(0, current - 1))}
                className="w-7 h-7 rounded-full border border-neutral-200 text-sm"
              >
                −
              </button>
              <span className="text-sm w-8 text-center">
                {current}/{total}
              </span>
              <button
                type="button"
                onClick={() => onChange(prayer, Math.min(total, current + 1))}
                className="w-7 h-7 rounded-full border border-neutral-200 text-sm"
              >
                +
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
