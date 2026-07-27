export type AdhkarCategory = "morning" | "evening";

export interface AdhkarItem {
  id: string;
  category: AdhkarCategory;
  text: string;
  targetCount: number;
  order: number;
}

export interface DuaCategory {
  id: string;
  name: string;
  color: string;
}

export interface Dua {
  id: string;
  text: string;
  categoryId: string | null;
  pinned: boolean;
}
