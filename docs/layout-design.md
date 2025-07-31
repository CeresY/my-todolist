# 左右布局设计文档

## 当前结构分析
当前页面采用顶部TAB页切换方式，所有内容垂直排列，TAB按钮位于页面顶部。

## 新布局设计目标
将页面结构修改为左右布局：
- 左侧：TAB切换区域（垂直排列的按钮）
- 右侧：内容展示区域

## 实现方案

### 1. 整体布局结构调整
```jsx
// 主容器采用水平flex布局
<div style={{
  display: 'flex',
  flexDirection: 'row',
  height: '100vh',
  width: '100vw'
}}>
  // 左侧TAB区域
  <div style={{
    width: '200px',
    backgroundColor: '#f8fafc',
    borderRight: '1px solid #e2e8f0',
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column'
  }}>
    // TAB按钮垂直排列
  </div>
  
  // 右侧内容区域
  <div style={{
    flex: 1,
    padding: '20px',
    overflow: 'auto'
  }}>
    // 根据选中的TAB显示对应内容
  </div>
</div>
```

### 2. TAB按钮样式调整
- 按钮垂直排列
- 宽度适应左侧区域
- 保持原有的激活状态样式

### 3. 内容区域适配
- 保持原有的内容组件不变
- 调整容器样式以适应右侧区域

## 样式更新

### 1. 新增左侧TAB区域样式
```css
.leftTabContainer {
  width: 200px;
  background-color: #f8fafc;
  border-right: 1px solid #e2e8f0;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
}
```

### 2. 调整TAB按钮样式
```css
.verticalTabButton {
  /* 继承原有按钮样式 */
  width: calc(100% - 20px);
  margin: 0 10px 8px 10px;
  border-radius: 8px;
  text-align: left;
  padding: 12px 16px;
}
```

## 组件修改点

### src/app/page.tsx
1. 修改主容器布局为水平flex
2. 将TAB按钮移至左侧区域并垂直排列
3. 调整内容区域以填充右侧空间
4. 保持状态管理和功能逻辑不变

## 预期效果
- 页面分为左右两个区域
- 左侧区域固定宽度，显示垂直排列的TAB按钮
- 右侧区域占据剩余空间，显示选中TAB对应的内容
- 功能保持不变，用户体验更加直观