import { Mood } from "@/types/habits";

export const MOOD_OPTIONS: { value: Mood; emoji: string; label: string }[] = [
  { value: "great", emoji: "😄", label: "رائع" },
  { value: "good", emoji: "🙂", label: "كويس" },
  { value: "okay", emoji: "😐", label: "عادي" },
  { value: "tired", emoji: "😞", label: "متعب" },
  { value: "bad", emoji: "😣", label: "سيء" },
];

export function getMoodEmoji(mood: Mood | undefined): string {
  return MOOD_OPTIONS.find((m) => m.value === mood)?.emoji ?? "";
}

export function getHabitBadge(
  daysDone: number,
  totalDays: number,
): { emoji: string; label: string } | null {
  const percent = (daysDone / totalDays) * 100;
  if (percent >= 90) return { emoji: "🥇", label: "ذهبي" };
  if (percent >= 70) return { emoji: "🥈", label: "فضي" };
  if (percent >= 40) return { emoji: "🥉", label: "برونزي" };
  return null;
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
