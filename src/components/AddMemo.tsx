"use client";

import React, { useState } from 'react';
import { Memo } from '@/types';
import { buttonStyle, inputStyle, textareaStyle, tagStyle } from '@/styles/styles';

interface AddMemoProps {
  onAddMemo: (memo: Memo) => void;
}

export default function AddMemo({ onAddMemo }: AddMemoProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      const tags = tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      try {
        const response = await fetch('/api/memos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim(),
            priority,
            tags: tags.length > 0 ? tags : undefined
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          onAddMemo(result.data);
          
          setTitle('');
          setContent('');
          setTagsInput('');
          setPriority('medium');
        } else {
          console.error('创建备忘录失败:', result.error);
          alert('创建备忘录失败: ' + result.error.message);
        }
      } catch (error) {
        console.error('创建备忘录失败:', error);
        alert('创建备忘录失败: 网络错误');
      }
    }
  };

  const prioritySelectStyle = {
    padding: '6px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    marginLeft: '5px'
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="备忘录标题..."
          style={{ ...inputStyle, width: '100%', marginBottom: '8px' }}
        />
      </div>
      
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="备忘录内容..."
          style={{ ...textareaStyle, marginBottom: '8px' }}
        />
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="标签 (用逗号分隔)..."
          style={{ ...inputStyle, width: '70%', marginBottom: '0' }}
        />
        
        <label style={{ marginLeft: '10px' }}>
          优先级:
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            style={prioritySelectStyle}
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </label>
      </div>
      
      <button type="submit" style={{ ...buttonStyle, marginLeft: '0' }}>
        添加备忘录
      </button>
    </form>
  );
}