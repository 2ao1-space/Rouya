"use client";

import { PrayerName, PrayerStatus } from "@/types/prayer";
import { PRAYER_ORDER, PRAYER_LABELS } from "@/lib/prayer";

interface PrayerDayCardProps {
  statuses: Record<PrayerName, PrayerStatus>;
  onCycle: (prayer: PrayerName, current: PrayerStatus) => void;
  readOnlyDate?: string;
}

const statusIcon: Record<PrayerStatus, string> = {
  prayed: "ti-circle-check",
  missed: "ti-circle-x",
  pending: "ti-circle-dashed",
};

const statusColor: Record<PrayerStatus, string> = {
  prayed: "text-green-600",
  missed: "text-red-500",
  pending: "text-neutral-300",
};

export function PrayerDayCard({ statuses, onCycle }: PrayerDayCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden">
      {PRAYER_ORDER.map((prayer, index) => {
        const status = statuses[prayer];
        return (
          <button
            key={prayer}
            type="button"
            onClick={() => onCycle(prayer, status)}
            className={`w-full flex items-center justify-between px-4 py-3 text-right ${
              index !== PRAYER_ORDER.length - 1
                ? "border-b border-neutral-100"
                : ""
            }`}
          >
            <span className="text-sm text-neutral-900">
              {PRAYER_LABELS[prayer]}
            </span>
            <i
              className={`ti ${statusIcon[status]} text-xl ${statusColor[status]}`}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}
