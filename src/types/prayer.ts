export type PrayerName = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
export type PrayerStatus = "prayed" | "missed" | "pending";

export interface PrayerLog {
  date: string; // "2026-07-22"
  prayer: PrayerName;
  status: PrayerStatus;
}

export interface NawafilLog {
  date: string;
  prayer: PrayerName;
  rakatsPrayed: number;
}

export interface QiyamLog {
  date: string;
  prayed: boolean;
  rakats: number;
}
