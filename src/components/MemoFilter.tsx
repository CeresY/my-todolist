"use client";

import React from 'react';
import { filterButtonStyle, activeFilterButtonStyle, inputStyle, cardStyle } from '@/styles';

interface MemoFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
  onPriorityFilterChange: (priority: 'all' | 'low' | 'medium' | 'high') => void;
  selectedTag: string;
  onTagFilterChange: (tag: string) => void;
  availableTags: string[];
}

export default function MemoFilter({
  searchTerm,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  selectedTag,
  onTagFilterChange,
  availableTags
}: MemoFilterProps) {
  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: '12px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜索备忘录..."
          style={{ ...inputStyle, width: '100%', marginBottom: '0' }}
        />
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <span style={{ marginRight: '12px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>优先级:</span>
        <button
          onClick={() => onPriorityFilterChange('all')}
          style={priorityFilter === 'all' ? activeFilterButtonStyle : filterButtonStyle}
        >
          全部
        </button>
        <button
          onClick={() => onPriorityFilterChange('high')}
          style={priorityFilter === 'high' ? activeFilterButtonStyle : filterButtonStyle}
        >
          高
        </button>
        <button
          onClick={() => onPriorityFilterChange('medium')}
          style={priorityFilter === 'medium' ? activeFilterButtonStyle : filterButtonStyle}
        >
          中
        </button>
        <button
          onClick={() => onPriorityFilterChange('low')}
          style={priorityFilter === 'low' ? activeFilterButtonStyle : filterButtonStyle}
        >
          低
        </button>
      </div>
      
      {availableTags.length > 0 && (
        <div>
          <span style={{ marginRight: '12px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>标签:</span>
          <button
            onClick={() => onTagFilterChange('')}
            style={selectedTag === '' ? activeFilterButtonStyle : filterButtonStyle}
          >
            全部
          </button>
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => onTagFilterChange(tag)}
              style={selectedTag === tag ? activeFilterButtonStyle : filterButtonStyle}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}