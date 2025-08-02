# 待办事项CRUD API接口实现文档

## 概述
本文档描述了待办事项CRUD API接口的具体实现方案，包括各个端点的实现逻辑、数据库操作和错误处理。

## 数据库操作函数 (src/lib/todo-db.ts)

```typescript
import pool from './db';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { Todo } from '@/types';

// 数据库行数据类型定义
interface TodoRow extends RowDataPacket {
  id: number;
  title: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

// 创建待办事项
export async function createTodo(title: string): Promise<Todo> {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO todos (title) VALUES (?)',
    [title]
  );
  
  const createdAt = new Date();
  const updatedAt = new Date();
  
  return {
    id: result.insertId,
    title,
    completed: false,
    createdAt,
    updatedAt
  };
}

// 获取所有待办事项
export async function getAllTodos(): Promise<Todo[]> {
  const [rows] = await pool.execute<TodoRow[]>(
    'SELECT * FROM todos ORDER BY created_at DESC'
  );
  
  return rows.map(row => ({
    id: row.id,
    title: row.title,
    completed: row.completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

// 根据过滤条件获取待办事项
export async function getFilteredTodos(filter: string): Promise<Todo[]> {
  let query = 'SELECT * FROM todos';
  let params: any[] = [];
  
  if (filter === 'active') {
    query += ' WHERE completed = FALSE';
  } else if (filter === 'completed') {
    query += ' WHERE completed = TRUE';
  }
  
  query += ' ORDER BY created_at DESC';
  
  const [rows] = await pool.execute<TodoRow[]>(query, params);
  
  return rows.map(row => ({
    id: row.id,
    title: row.title,
    completed: row.completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

// 根据ID获取待办事项
export async function getTodoById(id: number): Promise<Todo | null> {
  const [rows] = await pool.execute<TodoRow[]>(
    'SELECT * FROM todos WHERE id = ?',
    [id]
  );
  
  if (rows.length === 0) {
    return null;
  }
  
  const row = rows[0];
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// 更新待办事项
export async function updateTodo(id: number, updates: Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Todo | null> {
  const updateFields: string[] = [];
  const updateValues: any[] = [];
  
  if (updates.title !== undefined) {
    updateFields.push('title = ?');
    updateValues.push(updates.title);
  }
  
  if (updates.completed !== undefined) {
    updateFields.push('completed = ?');
    updateValues.push(updates.completed);
  }
  
  if (updateFields.length > 0) {
    updateValues.push(id);
    await pool.execute(
      `UPDATE todos SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
  }
  
  // 返回更新后的待办事项
  return await getTodoById(id);
}

// 删除待办事项
export async function deleteTodo(id: number): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM todos WHERE id = ?',
    [id]
  );
  
  return result.affectedRows > 0;
}

// 切换待办事项完成状态
export async function toggleTodo(id: number): Promise<Todo | null> {
  // 先获取当前状态
  const todo = await getTodoById(id);
  if (!todo) {
    return null;
  }
  
  // 更新状态
  return await updateTodo(id, { completed: !todo.completed });
}
```

## API路由实现

### 1. 待办事项主路由 (src/app/api/todos/route.ts)

```typescript
import { NextResponse } from 'next/server';
import { getAllTodos, getFilteredTodos, createTodo } from '@/lib/todo-db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    
    let todos;
    if (filter === 'all') {
      todos = await getAllTodos();
    } else {
      todos = await getFilteredTodos(filter);
    }
    
    return NextResponse.json({
      success: true,
      data: todos
    });
  } catch (error) {
    console.error('获取待办事项列表失败:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '获取待办事项列表失败'
      }
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title } = body;
    
    // 验证必填字段
    if (!title) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '标题为必填字段'
        }
      }, { status: 400 });
    }
    
    // 创建待办事项
    const newTodo = await createTodo(title);
    
    return NextResponse.json({
      success: true,
      data: newTodo
    }, { status: 201 });
  } catch (error) {
    console.error('创建待办事项失败:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '创建待办事项失败'
      }
    }, { status: 500 });
  }
}
```

### 2. 待办事项单个资源路由 (src/app/api/todos/[id]/route.ts)

```typescript
import { NextResponse } from 'next/server';
import { getTodoById, updateTodo, deleteTodo } from '@/lib/todo-db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    
    // 验证ID参数
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '无效的待办事项ID'
        }
      }, { status: 400 });
    }
    
    // 获取待办事项
    const todo = await getTodoById(id);
    
    if (!todo) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'TODO_NOT_FOUND',
          message: '待办事项不存在'
        }
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error('获取待办事项失败:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '获取待办事项失败'
      }
    }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    
    // 验证ID参数
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '无效的待办事项ID'
        }
      }, { status: 400 });
    }
    
    // 检查待办事项是否存在
    const existingTodo = await getTodoById(id);
    if (!existingTodo) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'TODO_NOT_FOUND',
          message: '待办事项不存在'
        }
      }, { status: 404 });
    }
    
    // 获取更新数据
    const body = await request.json();
    const { title, completed } = body;
    
    // 更新待办事项
    const updatedTodo = await updateTodo(id, {
      title,
      completed
    });
    
    return NextResponse.json({
      success: true,
      data: updatedTodo
    });
  } catch (error) {
    console.error('更新待办事项失败:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '更新待办事项失败'
      }
    }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    
    // 验证ID参数
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '无效的待办事项ID'
        }
      }, { status: 400 });
    }
    
    // 删除待办事项
    const deleted = await deleteTodo(id);
    
    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'TODO_NOT_FOUND',
          message: '待办事项不存在'
        }
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: '待办事项删除成功'
    });
  } catch (error) {
    console.error('删除待办事项失败:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '删除待办事项失败'
      }
    }, { status: 500 });
  }
}
```

### 3. 切换待办事项状态路由 (src/app/api/todos/[id]/toggle/route.ts)

```typescript
import { NextResponse } from 'next/server';
import { toggleTodo } from '@/lib/todo-db';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    
    // 验证ID参数
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '无效的待办事项ID'
        }
      }, { status: 400 });
    }
    
    // 切换待办事项状态
    const toggledTodo = await toggleTodo(id);
    
    if (!toggledTodo) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'TODO_NOT_FOUND',
          message: '待办事项不存在'
        }
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: toggledTodo
    });
  } catch (error) {
    console.error('切换待办事项状态失败:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '切换待办事项状态失败'
      }
    }, { status: 500 });
  }
}
```

## 错误处理和验证

### 输入验证函数 (src/lib/validation.ts)

```typescript
// 验证待办事项数据
export function validateTodoData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.title) {
    errors.push('标题为必填字段');
  } else if (typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('标题必须为非空字符串');
  }
  
  if (data.completed !== undefined && typeof data.completed !== 'boolean') {
    errors.push('完成状态必须为布尔值');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// 验证ID参数
export function validateId(id: string): { isValid: boolean; parsedId: number } {
  const parsedId = parseInt(id);
  return {
    isValid: !isNaN(parsedId) && parsedId > 0,
    parsedId
  };
}
```

## API使用示例

### 创建待办事项
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "完成项目文档"
  }'
```

### 获取所有待办事项
```bash
curl http://localhost:3000/api/todos
```

### 获取未完成的待办事项
```bash
curl "http://localhost:3000/api/todos?filter=active"
```

### 获取已完成的待办事项
```bash
curl "http://localhost:3000/api/todos?filter=completed"
```

### 获取单个待办事项
```bash
curl http://localhost:3000/api/todos/1
```

### 更新待办事项
```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新后的任务标题",
    "completed": true
  }'
```

### 删除待办事项
```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

### 切换待办事项完成状态
```bash
curl -X PATCH http://localhost:3000/api/todos/1/toggle