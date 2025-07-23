"use client"
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";
import TodoFilter from "@/components/TodoFilter";
import AddMemo from "@/components/AddMemo";
import MemoList from "@/components/MemoList";
import MemoFilter from "@/components/MemoFilter";
import {CSSProperties, useState, useEffect} from "react";
import {Todo, Memo} from "@/types";
import {centerDiv, headingStyle, tabButtonStyle, activeTabButtonStyle} from "@/styles";
import {saveTodos, loadTodos, saveMemos, loadMemos} from "@/utils/storage";
import {filterMemosBySearch, filterMemosByPriority, filterMemosByTag, getAllTags} from "@/utils/memoUtils";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState("")
  
  const [memos, setMemos] = useState<Memo[]>([])
  const [memoSearchTerm, setMemoSearchTerm] = useState('')
  const [memoPriorityFilter, setMemoPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [memoTagFilter, setMemoTagFilter] = useState('')
  const [activeTab, setActiveTab] = useState<'todos' | 'memos'>('todos')
  
  useEffect(() => {
    setTodos(loadTodos())
    setMemos(loadMemos())
  }, [])
  
  useEffect(() => {
    saveTodos(todos)
  }, [todos])
  
  useEffect(() => {
    saveMemos(memos)
  }, [memos])
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
        setMemos([...memos, memo])
    }
    
    const updateMemo = (updatedMemo: Memo) => {
        setMemos(memos.map(memo => memo.id === updatedMemo.id ? updatedMemo : memo))
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

  const containerStyle = {
    ...centerDiv,
    width: '900px',
    height: '700px'
  }

  return (
        <div style={containerStyle}>
          <div style={{ marginBottom: '24px' }}>
            <button 
              onClick={() => setActiveTab('todos')}
              style={activeTab === 'todos' ? activeTabButtonStyle : tabButtonStyle}
            >
              待办事项
            </button>
            <button 
              onClick={() => setActiveTab('memos')}
              style={activeTab === 'memos' ? activeTabButtonStyle : tabButtonStyle}
            >
              备忘录
            </button>
          </div>
          
          {activeTab === 'todos' ? (
            <div>
              <h1 style={headingStyle}>TodoList</h1>
              <AddTodo addTodo={addTodo}></AddTodo>
              <TodoList todos={getFilteredTodos()} deleteTodo={deleteTodo} toggleTodo={toggleTodo}></TodoList>
              <TodoFilter setFilter={setFilter}></TodoFilter>
            </div>
          ) : (
            <div>
              <h1 style={headingStyle}>备忘录</h1>
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
              <div style={{ maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
                <MemoList
                  memos={getFilteredMemos()}
                  onUpdateMemo={updateMemo}
                  onDeleteMemo={deleteMemo}
                />
              </div>
            </div>
          )}
        </div>
  );
}