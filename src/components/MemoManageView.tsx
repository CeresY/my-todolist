import AddMemo from "@/components/AddMemo";
import MemoFilter from "@/components/MemoFilter";
import { CSSProperties } from "react";
import { Memo } from "@/types";
import { headingStyle, memoCountBadgeStyle, compactMemoItemStyle, compactMemoTitleStyle, compactMemoContentStyle, compactMemoMetaStyle } from "@/styles/styles";

interface MemoManageViewProps {
  memos: Memo[];
  addMemo: (memo: Memo) => void;
  memoSearchTerm: string;
  setMemoSearchTerm: (term: string) => void;
  memoPriorityFilter: 'all' | 'low' | 'medium' | 'high';
  setMemoPriorityFilter: (filter: 'all' | 'low' | 'medium' | 'high') => void;
  memoTagFilter: string;
  setMemoTagFilter: (tag: string) => void;
  availableTags: string[];
  deleteMemo: (id: number) => void;
  filteredMemos: Memo[];
}

export default function MemoManageView({
  memos,
  addMemo,
  memoSearchTerm,
  setMemoSearchTerm,
  memoPriorityFilter,
  setMemoPriorityFilter,
  memoTagFilter,
  setMemoTagFilter,
  availableTags,
  filteredMemos
}: MemoManageViewProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      flex: 1,
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ ...headingStyle, marginBottom: '0' }}>备忘录管理</h1>
        {memos.length > 0 && (
          <span style={{
            ...memoCountBadgeStyle,
            backgroundColor: '#10b981',
            marginLeft: '12px'
          }}>
            {memos.length} 个备忘录
          </span>
        )}
      </div>
      
      <AddMemo onAddMemo={addMemo} />
      
      <MemoFilter
        searchTerm={memoSearchTerm}
        onSearchChange={setMemoSearchTerm}
        priorityFilter={memoPriorityFilter}
        onPriorityFilterChange={setMemoPriorityFilter}
        selectedTag={memoTagFilter}
        onTagFilterChange={setMemoTagFilter}
        availableTags={availableTags}
      />
      
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        paddingRight: '4px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '16px',
        marginTop: '16px'
      }}>
        <div style={{
          flex: 1,
          overflowY: 'auto'
        }}>
          {filteredMemos.length > 0 ? (
            filteredMemos.map(memo => (
              <div
                key={memo.id}
                style={compactMemoItemStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={compactMemoTitleStyle}>
                  {memo.title}
                </div>
                <div style={compactMemoContentStyle}>
                  {memo.content.length > 80 ? memo.content.substring(0, 80) + '...' : memo.content}
                </div>
                <div style={compactMemoMetaStyle}>
                  <span>
                    {memo.tags && memo.tags.length > 0 && (
                      <>
                        {memo.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} style={{
                            backgroundColor: '#e5e7eb',
                            color: '#374151',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            marginRight: '4px'
                          }}>
                            {tag}
                          </span>
                        ))}
                        {memo.tags.length > 2 && <span>+{memo.tags.length - 2}</span>}
                      </>
                    )}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      color: memo.priority === 'high' ? '#ef4444' :
                             memo.priority === 'medium' ? '#f59e0b' : '#9ca3af',
                      fontWeight: '500'
                    }}>
                      {memo.priority === 'high' ? '高' :
                       memo.priority === 'medium' ? '中' : '低'}
                    </span>
                    <span>{memo.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              color: '#6b7280',
              padding: '60px 20px',
              fontSize: '16px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>📋</div>
              <div>没有找到匹配的备忘录</div>
              <div style={{ fontSize: '14px', marginTop: '8px', color: '#9ca3af' }}>
                尝试调整筛选条件或创建新的备忘录
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}