import MemoFilter from "@/components/MemoFilter";
import MemoDisplayArea from "@/components/MemoDisplayArea";
import { Memo } from "@/types";
import { headingStyle, memoCountBadgeStyle } from "@/styles/styles";

interface MemoDisplayViewProps {
  memos: Memo[];
  filteredMemos: Memo[];
  memoSearchTerm: string;
  setMemoSearchTerm: (term: string) => void;
  memoPriorityFilter: 'all' | 'low' | 'medium' | 'high';
  setMemoPriorityFilter: (filter: 'all' | 'low' | 'medium' | 'high') => void;
  memoTagFilter: string;
  setMemoTagFilter: (tag: string) => void;
  availableTags: string[];
  updateMemo: (memo: Memo) => void;
  deleteMemo: (id: number) => void;
}

export default function MemoDisplayView({
  memos,
  filteredMemos,
  memoSearchTerm,
  setMemoSearchTerm,
  memoPriorityFilter,
  setMemoPriorityFilter,
  memoTagFilter,
  setMemoTagFilter,
  availableTags,
  updateMemo,
  deleteMemo
}: MemoDisplayViewProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      flex: 1,
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ ...headingStyle, marginBottom: '0' }}>备忘录展示</h1>
        {memos.length > 0 && (
          <span style={{
            ...memoCountBadgeStyle,
            backgroundColor: '#10b981',
            marginLeft: '12px'
          }}>
            {filteredMemos.length}/{memos.length}
          </span>
        )}
      </div>
      
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
        overflow: 'hidden'
      }}>
        <MemoDisplayArea
          memos={filteredMemos}
          onUpdateMemo={updateMemo}
          onDeleteMemo={deleteMemo}
          totalCount={memos.length}
          filteredCount={filteredMemos.length}
        />
      </div>
    </div>
  );
}