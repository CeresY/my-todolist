"use client";

import React from 'react';
import { Memo } from '@/types';
import MemoItem from './MemoItem';
import { memoDisplayAreaStyle, memoListContainerStyle, scrollIndicatorStyle } from '@/styles';

interface MemoDisplayAreaProps {
  memos: Memo[];
  onUpdateMemo: (updatedMemo: Memo) => void;
  onDeleteMemo: (id: number) => void;
  totalCount: number;
  filteredCount: number;
}

export default function MemoDisplayArea({ 
  memos, 
  onUpdateMemo, 
  onDeleteMemo, 
  totalCount, 
  filteredCount 
}: MemoDisplayAreaProps) {
  const hasScroll = memos.length > 3; // 预估超过3个备忘录就会出现滚动

  if (memos.length === 0) {
    return (
      <div style={memoDisplayAreaStyle}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '250px',
          color: '#6b7280',
          fontSize: '16px'
        }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            opacity: 0.3
          }}>
            📝
          </div>
          <div>
            {totalCount === 0 ? '还没有备忘录，开始创建第一个吧！' : '没有找到匹配的备忘录'}
          </div>
          {totalCount > 0 && filteredCount === 0 && (
            <div style={{ 
              fontSize: '14px', 
              marginTop: '8px',
              color: '#9ca3af'
            }}>
              共有 {totalCount} 个备忘录，尝试调整筛选条件
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={memoDisplayAreaStyle}>
      {/* 滚动指示器 */}
      {hasScroll && (
        <div style={scrollIndicatorStyle} />
      )}
      
      {/* 备忘录列表 */}
      <div style={memoListContainerStyle}>
        {memos.map((memo, index) => (
          <div key={memo.id} style={{ 
            animationDelay: `${index * 50}ms`,
            animation: 'fadeInUp 0.3s ease forwards',
            opacity: 0
          }}>
            <MemoItem
              memo={memo}
              onUpdateMemo={onUpdateMemo}
              onDeleteMemo={onDeleteMemo}
            />
          </div>
        ))}
      </div>
      
      {/* 底部统计信息 */}
      <div style={{
        position: 'sticky',
        bottom: '-16px',
        backgroundColor: 'rgba(248, 250, 252, 0.95)',
        backdropFilter: 'blur(8px)',
        padding: '12px 0 0 0',
        marginTop: '8px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#6b7280',
        borderTop: '1px solid rgba(226, 232, 240, 0.5)'
      }}>
        显示 {filteredCount} 个备忘录
        {totalCount !== filteredCount && ` / 共 ${totalCount} 个`}
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}