export type Mood = "great" | "good" | "okay" | "tired" | "bad";

export interface Habit {
  id: string;
  name: string;
  order: number;
}

export interface DailyTask {
  id: string;
  date: string;
  text: string;
  done: boolean;
  order: number;
}
