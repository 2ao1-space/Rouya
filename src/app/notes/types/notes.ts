export type NoteType = "text" | "todo" | "image" | "drawing";

export interface NoteCategory {
  id: string;
  name: string;
  color: string;
}

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  order: number;
}

export interface Note {
  id: string;
  type: NoteType;
  categoryId: string | null;
  textContent: string | null;
  imagePath: string | null;
  pinned: boolean;
  createdAt: string;
}
