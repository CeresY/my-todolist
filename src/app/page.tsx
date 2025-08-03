"use client"
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";
import TodoFilter from "@/components/TodoFilter";
import AddMemo from "@/components/AddMemo";
import MemoDisplayArea from "@/components/MemoDisplayArea";
import MemoFilter from "@/components/MemoFilter";
import TodoView from "@/components/TodoView";
import MemoManageView from "@/components/MemoManageView";
import MemoDisplayView from "@/components/MemoDisplayView";
import {CSSProperties, useState, useEffect} from "react";
import {Todo, Memo} from "@/types";
import {centerDiv, headingStyle, tabButtonStyle, activeTabButtonStyle, memoCountBadgeStyle, compactMemoItemStyle, compactMemoTitleStyle, compactMemoContentStyle, compactMemoMetaStyle} from "@/styles/styles";
import {saveTodos, loadTodos, saveMemos, loadMemos} from "@/lib/storage";
import {filterMemosBySearch, filterMemosByPriority, filterMemosByTag, getAllTags} from "@/lib/memoUtils";
import { Console } from "console";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState("")
  
  const [memos, setMemos] = useState<Memo[]>([])
  const [memoSearchTerm, setMemoSearchTerm] = useState('')
  const [memoPriorityFilter, setMemoPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [memoTagFilter, setMemoTagFilter] = useState('')
  const [activeTab, setActiveTab] = useState<'todos' | 'memos' | 'memoDisplay'>('todos')
  
    useEffect(() => {
      setTodos(loadTodos())
      loadMemosFromAPI()
    }, [])
    
    useEffect(() => {
      saveTodos(todos)
    }, [todos])
    
    const loadMemosFromAPI = async () => {
      try {
        const response = await fetch('/api/memos')
        const result = await response.json()
        
        if (result.success) {

          // 确保日期字段被正确转换为Date对象
          const memosWithDates = result.data.map((memo: any) => ({
            ...memo,
            createdAt: new Date(memo.createdAt),
            updatedAt: new Date(memo.updatedAt),
            // 确保tags字段是一个数组，即使是空数组
            tags: Array.isArray(memo.tags) ? memo.tags : []
          }));

          setMemos(memosWithDates)
        } else {
          console.error('获取备忘录失败:', result.error)
        }
      } catch (error) {
        console.error('获取备忘录失败:', error)
      }
    }

    const addTodo = (text: string) => {
      const newTodo: Todo = {
          id: Math.random(),
          title: text,
          completed: false
      }
        setTodos([...todos, newTodo])
    }

    const deleteTodo = (id: number) => {
      setTodos(todos.filter(todo => todo.id !== id))
    }

    const toggleTodo = (id: number) => {
      setTodos(todos.map(todo => {
          if (todo.id === id) {
              return {
                  ...todo,
                  completed: !todo.completed
              }
          }
          return todo
      }))
    }

    const getFilteredTodos = ():Array<Todo> => {
        switch (filter) {
            case 'active':
                return todos.filter(todo => !todo.completed)
            case 'completed':
                return todos.filter(todo => todo.completed)
            default:
                return todos
        }
    }
    
    const addMemo = (memo: Memo) => {
        // console.log('Adding memo:', memo)

        const newMemo = {
          ...memo,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        setMemos([...memos, newMemo])
    }
    
    const updateMemo = (updatedMemo: Memo) => {
      console.log('Updating memo:', updatedMemo);
        const memoToUpdate: Memo = {
          ...updatedMemo,
          createdAt: updatedMemo.createdAt ? new Date(updatedMemo.createdAt) : new Date(),
          updatedAt: new Date()
        }
      setMemos(memos.map(memo => memo.id === memoToUpdate.id ? memoToUpdate : memo))
    }
    
    const deleteMemo = (id: number) => {
        setMemos(memos.filter(memo => memo.id !== id))
    }
    
    const getFilteredMemos = (): Memo[] => {
        let filtered = memos
        
        filtered = filterMemosBySearch(filtered, memoSearchTerm)
        filtered = filterMemosByPriority(filtered, memoPriorityFilter)
        filtered = filterMemosByTag(filtered, memoTagFilter)
        
        return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    }
    
    const availableTags = getAllTags(memos)

  const containerStyle: CSSProperties = {
    ...centerDiv,
    width: 'calc(100vw - 40px)',
    height: 'calc(100vh - 40px)',
    maxWidth: 'none',
    maxHeight: 'none',
    display: 'flex',
    flexDirection: 'row' as const,
    overflow: 'hidden',
    boxSizing: 'border-box',
    padding: '0'
  }

  // 左侧TAB区域样式
  const leftTabStyle: CSSProperties = {
    width: '200px',
    backgroundColor: '#f8fafc',
    borderRight: '1px solid #e2e8f0',
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%'
  }

  // 垂直TAB按钮样式
  const verticalTabButtonStyle: CSSProperties = {
    ...tabButtonStyle,
    width: 'calc(100% - 20px)',
    margin: '0 10px 8px 10px',
    borderRadius: '8px',
    textAlign: 'left' as const,
    padding: '12px 16px',
    justifyContent: 'flex-start'
  }

  const verticalActiveTabButtonStyle: CSSProperties = {
    ...activeTabButtonStyle,
    width: 'calc(100% - 20px)',
    margin: '0 10px 8px 10px',
    borderRadius: '8px',
    textAlign: 'left' as const,
    padding: '12px 16px',
    justifyContent: 'flex-start'
  }

  // 右侧内容区域样式
  const rightContentStyle: CSSProperties = {
    flex: 1,
    height: '100%',
    overflow: 'auto',
    padding: '20px'
  }

  const filteredMemos = getFilteredMemos()
    
    const showContainer = () => {
        if(activeTab === 'memos') {
            return <MemoManageView
                memos={memos}
                addMemo={addMemo}
                memoSearchTerm={memoSearchTerm}
                setMemoSearchTerm={setMemoSearchTerm}
                memoPriorityFilter={memoPriorityFilter}
                setMemoPriorityFilter={setMemoPriorityFilter}
                memoTagFilter={memoTagFilter}
                setMemoTagFilter={setMemoTagFilter}
                availableTags={availableTags}
                deleteMemo={deleteMemo}
                filteredMemos={filteredMemos}
            />
        }
        else if(activeTab === 'memoDisplay') {
            return <MemoDisplayView
                memos={memos}
                filteredMemos={filteredMemos}
                memoSearchTerm={memoSearchTerm}
                setMemoSearchTerm={setMemoSearchTerm}
                memoPriorityFilter={memoPriorityFilter}
                setMemoPriorityFilter={setMemoPriorityFilter}
                memoTagFilter={memoTagFilter}
                setMemoTagFilter={setMemoTagFilter}
                availableTags={availableTags}
                updateMemo={updateMemo}
                deleteMemo={deleteMemo}
            />
        }
        return <TodoView
            addTodo={addTodo}
            getFilteredTodos={getFilteredTodos}
            deleteTodo={deleteTodo}
            toggleTodo={toggleTodo}
            setFilter={setFilter}
        />
    }

  return (
        <div style={containerStyle}>
          {/* 左侧TAB区域 */}
          <div style={leftTabStyle}>
            <button
              onClick={() => setActiveTab('todos')}
              style={activeTab === 'todos' ? verticalActiveTabButtonStyle : verticalTabButtonStyle}
            >
              待办事项
              {todos.length > 0 && (
                <span style={memoCountBadgeStyle}>{todos.length}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('memos')}
              style={activeTab === 'memos' ? verticalActiveTabButtonStyle : verticalTabButtonStyle}
            >
              备忘录管理
              {memos.length > 0 && (
                <span style={memoCountBadgeStyle}>{memos.length}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('memoDisplay')}
              style={activeTab === 'memoDisplay' ? verticalActiveTabButtonStyle : verticalTabButtonStyle}
            >
              备忘录展示
              {filteredMemos.length > 0 && (
                <span style={{
                  ...memoCountBadgeStyle,
                  backgroundColor: '#10b981'
                }}>
                  {filteredMemos.length}
                </span>
              )}
            </button>
          </div>
          
          {/* 右侧内容区域 */}
          <div style={rightContentStyle}>{showContainer()}</div>
        </div>
  );
}