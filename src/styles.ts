import {CSSProperties} from "react";

// 浅色模式配色方案
const lightColors = {
  primary: '#3b82f6',        // 柔和蓝色 (主要按钮)
  primaryHover: '#2563eb',   // 主色悬停
  secondary: '#6b7280',      // 次要按钮
  background: '#ffffff',     // 主背景
  surface: '#f8fafc',        // 卡片背景
  surfaceHover: '#f1f5f9',   // 卡片悬停
  border: '#e2e8f0',         // 边框
  borderLight: '#f1f5f9',    // 浅边框
  text: '#1f2937',           // 主文本
  textSecondary: '#6b7280',  // 次要文本
  textMuted: '#9ca3af',      // 弱化文本
  success: '#10b981',        // 成功色
  warning: '#f59e0b',        // 警告色
  danger: '#ef4444',         // 危险色
  tag: '#e5e7eb',            // 标签背景
  tagText: '#374151'         // 标签文本
};

export const buttonStyle: CSSProperties = {
    backgroundColor: lightColors.primary,
    color: 'white',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginLeft: '10px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
}

export const inputStyle: CSSProperties = {
    width: '80%',
    padding: '12px',
    marginBottom: '12px',
    border: `1px solid ${lightColors.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: lightColors.background,
    color: lightColors.text,
    transition: 'border-color 0.2s ease',
    outline: 'none'
}

export const centerDiv: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    height: '500px',
    border: `1px solid ${lightColors.border}`,
    borderRadius: '12px',
    padding: '24px',
    backgroundColor: lightColors.background,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
}

export const textareaStyle: CSSProperties = {
    width: '100%',
    minHeight: '100px',
    padding: '12px',
    border: `1px solid ${lightColors.border}`,
    borderRadius: '8px',
    resize: 'vertical',
    fontFamily: 'inherit',
    fontSize: '14px',
    backgroundColor: lightColors.background,
    color: lightColors.text,
    transition: 'border-color 0.2s ease',
    outline: 'none',
    lineHeight: '1.5'
}

export const memoItemStyle: CSSProperties = {
    border: `1px solid ${lightColors.border}`,
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
    backgroundColor: lightColors.surface,
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
}

export const tagStyle: CSSProperties = {
    backgroundColor: lightColors.tag,
    color: lightColors.tagText,
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    marginRight: '6px',
    marginBottom: '4px',
    display: 'inline-block'
}

export const priorityStyles = {
    low: { color: lightColors.textMuted, fontWeight: '500' },
    medium: { color: lightColors.warning, fontWeight: '600' },
    high: { color: lightColors.danger, fontWeight: '600' }
}

export const filterButtonStyle: CSSProperties = {
    backgroundColor: lightColors.secondary,
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '8px',
    marginBottom: '4px',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
}

export const activeFilterButtonStyle: CSSProperties = {
    ...filterButtonStyle,
    backgroundColor: lightColors.primary,
    boxShadow: '0 1px 3px 0 rgba(59, 130, 246, 0.3)'
}

// 新增样式
export const cardStyle: CSSProperties = {
    backgroundColor: lightColors.surface,
    border: `1px solid ${lightColors.borderLight}`,
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '16px'
}

export const headingStyle: CSSProperties = {
    color: lightColors.text,
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: '600'
}

export const tabButtonStyle: CSSProperties = {
    backgroundColor: lightColors.surface,
    border: `1px solid ${lightColors.border}`,
    padding: '12px 20px',
    cursor: 'pointer',
    borderRadius: '8px 8px 0 0',
    marginRight: '2px',
    fontSize: '14px',
    fontWeight: '500',
    color: lightColors.text,
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden'
}

export const activeTabButtonStyle: CSSProperties = {
    ...tabButtonStyle,
    backgroundColor: lightColors.primary,
    color: 'white',
    borderColor: lightColors.primary,
    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
    transform: 'translateY(-1px)'
}

// 新增简洁列表样式
export const compactMemoItemStyle: CSSProperties = {
    backgroundColor: 'white',
    border: `1px solid ${lightColors.border}`,
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '8px',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
}

export const compactMemoTitleStyle: CSSProperties = {
    fontWeight: '600',
    marginBottom: '4px',
    color: lightColors.text,
    fontSize: '14px'
}

export const compactMemoContentStyle: CSSProperties = {
    color: lightColors.textSecondary,
    fontSize: '13px',
    lineHeight: '1.4',
    marginBottom: '8px'
}

export const compactMemoMetaStyle: CSSProperties = {
    fontSize: '12px',
    color: lightColors.textMuted,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}

// 新增展示区域样式
export const memoDisplayAreaStyle: CSSProperties = {
    backgroundColor: lightColors.surface,
    border: `1px solid ${lightColors.border}`,
    borderRadius: '10px',
    padding: '16px',
    marginTop: '16px',
    maxHeight: '420px',
    minHeight: '300px',
    overflowY: 'auto',
    position: 'relative'
}

export const memoListContainerStyle: CSSProperties = {
    paddingRight: '8px'
}

export const scrollIndicatorStyle: CSSProperties = {
    position: 'sticky',
    top: '-16px',
    left: '0',
    right: '0',
    height: '4px',
    background: 'linear-gradient(to right, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.1))',
    borderRadius: '2px',
    marginBottom: '12px',
    zIndex: 1
}

export const memoCountBadgeStyle: CSSProperties = {
    backgroundColor: lightColors.primary,
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    marginLeft: '8px',
    display: 'inline-block'
}