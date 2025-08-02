"use client"
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";
import TodoFilter from "@/components/TodoFilter";
import AddMemo from "@/components/AddMemo";
import MemoDisplayArea from "@/components/MemoDisplayArea";
import MemoFilter from "@/components/MemoFilter";
import {CSSProperties, useState, useEffect} from "react";
import {Todo, Memo} from "@/types";
import {centerDiv, headingStyle, tabButtonStyle, activeTabButtonStyle, memoCountBadgeStyle, compactMemoItemStyle, compactMemoTitleStyle, compactMemoContentStyle, compactMemoMetaStyle} from "@/styles/styles";
import {saveTodos, loadTodos, saveMemos, loadMemos} from "@/lib/storage";
import {filterMemosBySearch, filterMemosByPriority, filterMemosByTag, getAllTags} from "@/lib/memoUtils";

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
          <div style={rightContentStyle}>
          {activeTab === 'todos' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden'
            }}>
              <h1 style={headingStyle}>TodoList</h1>
              <AddTodo addTodo={addTodo}></AddTodo>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                maxHeight: 'calc(100% - 120px)'
              }}>
                <TodoList todos={getFilteredTodos()} deleteTodo={deleteTodo} toggleTodo={toggleTodo}></TodoList>
              </div>
              <TodoFilter setFilter={setFilter}></TodoFilter>
            </div>
          )}
          
          {activeTab === 'memos' && (
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
          )}
          
          {activeTab === 'memoDisplay' && (
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
          )}
        </div>
        </div>
  );
}