"use client";

import React from 'react';
import { Memo } from '@/types';
import MemoItem from './MemoItem';

interface MemoListProps {
  memos: Memo[];
  onUpdateMemo: (updatedMemo: Memo) => void;
  onDeleteMemo: (id: number) => void;
}

export default function MemoList({ memos, onUpdateMemo, onDeleteMemo }: MemoListProps) {
  if (memos.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        color: '#6b7280', 
        padding: '40px 20px',
        fontSize: '16px'
      }}>
        暂无备忘录
      </div>
    );
  }

  return (
    <div>
      {memos.map(memo => (
        <MemoItem
          key={memo.id}
          memo={memo}
          onUpdateMemo={onUpdateMemo}
          onDeleteMemo={onDeleteMemo}
        />
      ))}
    </div>
  );
}