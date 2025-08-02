# 数据库设计文档

## 概述
本文档描述了备忘录应用的数据库表结构设计，用于支持Next.js后端API服务的持久化存储。

## 数据库表结构

### 1. 待办事项表 (todos)
存储用户的待办事项信息。

| 字段名 | 类型 | 约束 | 描述 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 待办事项唯一标识 |
| title | VARCHAR(255) | NOT NULL | 待办事项标题 |
| completed | BOOLEAN | NOT NULL, DEFAULT FALSE | 是否完成 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

### 2. 备忘录表 (memos)
存储用户的备忘录信息。

| 字段名 | 类型 | 约束 | 描述 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 备忘录唯一标识 |
| title | VARCHAR(255) | NOT NULL | 备忘录标题 |
| content | TEXT | NOT NULL | 备忘录内容 |
| priority | ENUM('low', 'medium', 'high') | DEFAULT 'medium' | 优先级 |
| tags | JSON |  | 标签信息 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

## 索引设计

### todos表索引
- 主键索引: id
- 默认索引: created_at, updated_at

### memos表索引
- 主键索引: id
- 默认索引: created_at, updated_at, priority

## SQL创建语句

```sql
-- 创建todos表
CREATE TABLE todos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建memos表
CREATE TABLE memos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  tags JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API数据结构映射

### Todo数据结构
```typescript
type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Memo数据结构
```typescript
type Memo = {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
}
```

## 数据库连接配置
- 主机: localhost
- 端口: 3306
- 数据库名: memo_app
- 用户名: memo_user
- 密码: memo_password