import { Todo, Memo } from "@/types";

const TODOS_STORAGE_KEY = "todos";
const MEMOS_STORAGE_KEY = "memos";

// Todo storage functions
export const saveTodos = (todos: Todo[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  }
};

export const loadTodos = (): Todo[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(TODOS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

// Memo storage functions
export const saveMemos = (memos: Memo[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(MEMOS_STORAGE_KEY, JSON.stringify(memos, (key, value) => {
      if (key === 'createdAt' || key === 'updatedAt') {
        return value instanceof Date ? value.toISOString() : value;
      }
      return value;
    }));
  }
};

export const loadMemos = (): Memo[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(MEMOS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((memo: any) => ({
        ...memo,
        createdAt: new Date(memo.createdAt),
        updatedAt: new Date(memo.updatedAt)
      }));
    }
  }
  return [];
};