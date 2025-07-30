# 左右布局实现计划

## 任务目标
将页面上部的TAB页切换方式改为左右结构：
- 左侧为tab切换区域
- 右侧为对应的展示区域

## 实现步骤

### 1. 修改主页面组件 (src/app/page.tsx)

#### 1.1 修改主容器布局
将主容器从垂直布局改为水平布局：
```jsx
// 原有样式
const containerStyle: CSSProperties = {
  ...centerDiv,
  width: 'calc(100vw - 40px)',
  height: 'calc(100vh - 40px)',
  maxWidth: 'none',
  maxHeight: 'none',
  display: 'flex',
  flexDirection: 'column' as const,
  overflow: 'hidden',
  boxSizing: 'border-box'
}

// 修改为
const containerStyle: CSSProperties = {
  ...centerDiv,
  width: 'calc(100vw - 40px)',
  height: 'calc(100vh - 40px)',
  maxWidth: 'none',
  maxHeight: 'none',
  display: 'flex',
  flexDirection: 'row' as const,  // 改为水平布局
  overflow: 'hidden',
  boxSizing: 'border-box',
  padding: '0'  // 移除内边距以最大化利用空间
}
```

#### 1.2 创建左侧TAB区域
将原有的TAB按钮移至左侧区域：
```jsx
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

// TAB按钮样式调整
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
```

#### 1.3 调整右侧内容区域
修改内容区域以适应右侧空间：
```jsx
// 右侧内容区域样式
const rightContentStyle: CSSProperties = {
  flex: 1,
  height: '100%',
  overflow: 'auto',
  padding: '20px'
}
```

#### 1.4 更新JSX结构
```jsx
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
        // 待办事项内容
      )}
      
      {activeTab === 'memos' && (
        // 备忘录管理内容
      )}
      
      {activeTab === 'memoDisplay' && (
        // 备忘录展示内容
      )}
    </div>
  </div>
)
```

### 2. 样式优化

#### 2.1 调整内容区域样式
需要调整各个TAB内容区域的样式，移除原有的高度限制，让内容自然填充右侧区域。

#### 2.2 优化滚动条样式
确保右侧内容区域能正确显示滚动条。

## 验证要点

1. 布局正确显示为左右结构
2. TAB按钮垂直排列在左侧
3. 内容显示在右侧区域
4. TAB切换功能正常
5. 各个功能模块显示正常
6. 响应式设计在不同屏幕尺寸下表现良好

## 注意事项

1. 保持原有的状态管理逻辑不变
2. 保持所有功能组件不变
3. 确保样式在不同屏幕尺寸下的兼容性
4. 测试所有TAB切换功能是否正常工作