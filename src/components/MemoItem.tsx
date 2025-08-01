"use client";

import React, { useState } from 'react';
import { Memo } from '@/types';
import { updateMemo } from '@/lib/memoUtils';
import { memoItemStyle, tagStyle, priorityStyles, buttonStyle } from '@/styles';

interface MemoItemProps {
  memo: Memo;
  onUpdateMemo: (updatedMemo: Memo) => void;
  onDeleteMemo: (id: number) => void;
}

export default function MemoItem({ memo, onUpdateMemo, onDeleteMemo }: MemoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(memo.title);
  const [editContent, setEditContent] = useState(memo.content);
  const [editTagsInput, setEditTagsInput] = useState(memo.tags?.join(', ') || '');
  const [editPriority, setEditPriority] = useState(memo.priority || 'medium');

  const handleSave = () => {
    const tags = editTagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    const updatedMemo = updateMemo(memo, {
      title: editTitle.trim(),
      content: editContent.trim(),
      tags: tags.length > 0 ? tags : undefined,
      priority: editPriority
    });
    
    onUpdateMemo(updatedMemo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(memo.title);
    setEditContent(memo.content);
    setEditTagsInput(memo.tags?.join(', ') || '');
    setEditPriority(memo.priority || 'medium');
    setIsEditing(false);
  };

  const priorityText = {
    low: '低',
    medium: '中',
    high: '高'
  };

  const editInputStyle = {
    width: '100%',
    padding: '4px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    marginBottom: '8px'
  };

  const editTextareaStyle = {
    ...editInputStyle,
    minHeight: '60px',
    resize: 'vertical' as const
  };

  if (isEditing) {
    return (
      <div style={memoItemStyle}>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          style={editInputStyle}
        />
        
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          style={editTextareaStyle}
        />
        
        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            value={editTagsInput}
            onChange={(e) => setEditTagsInput(e.target.value)}
            placeholder="标签 (用逗号分隔)..."
            style={{ ...editInputStyle, width: '60%', marginRight: '12px' }}
          />
          
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
            style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px' }}
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>
        
        <button onClick={handleSave} style={{ ...buttonStyle, marginLeft: '0', marginRight: '8px' }}>
          保存
        </button>
        <button 
          onClick={handleCancel} 
          style={{ ...buttonStyle, backgroundColor: '#6b7280' }}
        >
          取消
        </button>
      </div>
    );
  }

  return (
    <div style={memoItemStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <h4 style={{ margin: '0', color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>{memo.title}</h4>
        <div>
          <button 
            onClick={() => setIsEditing(true)} 
            style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white',
              padding: '6px 12px', 
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              marginRight: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            编辑
          </button>
          <button 
            onClick={() => onDeleteMemo(memo.id)} 
            style={{ 
              backgroundColor: '#ef4444', 
              color: 'white',
              padding: '6px 12px', 
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            删除
          </button>
        </div>
      </div>
      
      <p style={{ margin: '0 0 12px 0', lineHeight: '1.6', whiteSpace: 'pre-wrap', color: '#374151' }}>
        {memo.content}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#6b7280' }}>
        <div>
          {memo.tags && memo.tags.length > 0 && (
            <div style={{ marginBottom: '6px' }}>
              {memo.tags.map((tag, index) => (
                <span key={index} style={tagStyle}>{tag}</span>
              ))}
            </div>
          )}
          
          <div>
            <span style={{ marginRight: '12px' }}>
              优先级: <span style={priorityStyles[memo.priority || 'medium']}>
                {priorityText[memo.priority || 'medium']}
              </span>
            </span>
            <span>创建: {memo.createdAt.toLocaleDateString()}</span>
            {memo.updatedAt.getTime() !== memo.createdAt.getTime() && (
              <span style={{ marginLeft: '12px' }}>
                更新: {memo.updatedAt.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}