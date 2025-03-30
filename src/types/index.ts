
export interface Todo {
  id: string;
  text: string;
  isCompleted: boolean;
  time: string | null;
  category?: string;
}

export interface Goal {
  id: string;
  text: string;
  isCompleted: boolean;
  hasProgress: boolean;
  current?: number;
  target?: number;
  unit?: string;
  autoIncrement?: boolean;
  category?: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  title: string;
  content: string;
  mood?: 'happy' | 'neutral' | 'sad' | 'productive' | 'tired';
}

export interface DailyData {
  date: string; // ISO string
  todos: Todo[];
  goals: Goal[];
}
