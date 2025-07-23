import { Memo } from "@/types";

export const generateMemoId = (): number => {
  return Math.floor(Math.random() * 1000000);
};

export const createMemo = (title: string, content: string, tags?: string[], priority?: 'low' | 'medium' | 'high'): Memo => {
  const now = new Date();
  return {
    id: generateMemoId(),
    title,
    content,
    createdAt: now,
    updatedAt: now,
    tags,
    priority
  };
};

export const updateMemo = (memo: Memo, updates: Partial<Omit<Memo, 'id' | 'createdAt'>>): Memo => {
  return {
    ...memo,
    ...updates,
    updatedAt: new Date()
  };
};

export const filterMemosBySearch = (memos: Memo[], searchTerm: string): Memo[] => {
  if (!searchTerm.trim()) return memos;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return memos.filter(memo => 
    memo.title.toLowerCase().includes(lowerSearchTerm) ||
    memo.content.toLowerCase().includes(lowerSearchTerm) ||
    memo.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
  );
};

export const filterMemosByPriority = (memos: Memo[], priority: 'low' | 'medium' | 'high' | 'all'): Memo[] => {
  if (priority === 'all') return memos;
  return memos.filter(memo => memo.priority === priority);
};

export const filterMemosByTag = (memos: Memo[], tag: string): Memo[] => {
  if (!tag) return memos;
  return memos.filter(memo => memo.tags?.includes(tag));
};

export const getAllTags = (memos: Memo[]): string[] => {
  const tagSet = new Set<string>();
  memos.forEach(memo => {
    memo.tags?.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};