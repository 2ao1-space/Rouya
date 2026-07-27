import { PrayerName } from "@/types/prayer";

export const PRAYER_ORDER: PrayerName[] = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
];

export const PRAYER_LABELS: Record<PrayerName, string> = {
  fajr: "الفجر",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};

export const NAWAFIL_CONFIG: Record<
  PrayerName,
  { before: number; after: number }
> = {
  fajr: { before: 2, after: 0 },
  dhuhr: { before: 2, after: 4 },
  asr: { before: 0, after: 0 },
  maghrib: { before: 0, after: 2 },
  isha: { before: 0, after: 2 },
};

export const TOTAL_NAWAFIL_RAKATS = Object.values(NAWAFIL_CONFIG).reduce(
  (sum, c) => sum + c.before + c.after,
  0,
);

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
