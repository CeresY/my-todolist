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



    // console.log('save old Memos:', existingMemos);
    console.log('Add new Memos:', memos);

    // 或者如果你只想添加新的备忘录到现有列表中：
    // const mergedMemos = [...existingMemos, ...memos];

    if (memos.length === 0) {
      return ;
    }

    const newMemos = mergeMemos(memos);

    localStorage.setItem(MEMOS_STORAGE_KEY, JSON.stringify(newMemos, (key, value) => {
      if (key === 'createdAt' || key === 'updatedAt') {
        return value instanceof Date ? value.toISOString() : value;
      }
      return value;
    }));
  }
};

function mergeMemos(newMemos: Memo[]): Memo[] { 
    const existingMemos = loadMemos();
    
    // 基于 ID 合并，避免重复并更新现有项
    const mergedMemos = [...existingMemos];
    
    newMemos.forEach(newMemo => {
      const existingIndex = mergedMemos.findIndex(memo => memo.id === newMemo.id);
      if (existingIndex >= 0) {
        // 更新现有备忘录
        mergedMemos[existingIndex] = newMemo;
      } else {
        // 添加新备忘录
        mergedMemos.push(newMemo);
      }
    });

    return mergedMemos;
}

export const loadMemos = (): Memo[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(MEMOS_STORAGE_KEY);
    console.log('Load Memos:', stored);

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