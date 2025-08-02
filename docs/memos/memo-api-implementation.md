# 备忘录CRUD API接口实现文档

## 概述
本文档描述了备忘录CRUD API接口的具体实现方案，包括各个端点的实现逻辑、数据库操作和错误处理。

## 数据库操作函数 (src/lib/memo-db.ts)

```typescript
import pool from './db';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { Memo } from '@/types';

// 数据库行数据类型定义
interface MemoRow extends RowDataPacket {
  id: number;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  created_at: Date;
  updated_at: Date;
}

interface MemoTagRow extends RowDataPacket {
  id: number;
  memo_id: number;
  tag: string;
}

// 创建备忘录
export async function createMemo(memo: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Memo> {
  const { title, content, priority = 'medium', tags = [] } = memo;
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // 插入备忘录主记录
    const [result] = await connection.execute<ResultSetHeader>(
      'INSERT INTO memos (title, content, priority) VALUES (?, ?, ?)',
      [title, content, priority]
    );
    
    const memoId = result.insertId;
    const createdAt = new Date();
    const updatedAt = new Date();
    
    // 插入标签
    if (tags.length > 0) {
      const tagValues = tags.map(tag => [memoId, tag]);
      await connection.query(
        'INSERT INTO memo_tags (memo_id, tag) VALUES ?',
        [tagValues]
      );
    }
    
    await connection.commit();
    
    return {
      id: memoId,
      title,
      content,
      priority,
      tags,
      createdAt,
      updatedAt
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// 获取所有备忘录
export async function getAllMemos(): Promise<Memo[]> {
  const connection = await pool.getConnection();
  try {
    // 获取备忘录主记录
    const [memos] = await connection.execute<MemoRow[]>(
      'SELECT * FROM memos ORDER BY updated_at DESC'
    );
    
    // 获取所有标签
    const [tags] = await connection.execute<MemoTagRow[]>(
      'SELECT * FROM memo_tags'
    );
    
    // 构建备忘录对象
    return memos.map(memo => {
      const memoTags = tags
        .filter(tag => tag.memo_id === memo.id)
        .map(tag => tag.tag);
      
      return {
        id: memo.id,
        title: memo.title,
        content: memo.content,
        priority: memo.priority,
        tags: memoTags,
        createdAt: memo.created_at,
        updatedAt: memo.updated_at
      };
    });
  } finally {
    connection.release();
  }
}

// 根据ID获取备忘录
export async function getMemoById(id: number): Promise<Memo | null> {
  const connection = await pool.getConnection();
  try {
    // 获取备忘录主记录
    const [memos] = await connection.execute<MemoRow[]>(
      'SELECT * FROM memos WHERE id = ?',
      [id]
    );
    
    if (memos.length === 0) {
      return null;
    }
    
    const memo = memos[0];
    
    // 获取标签
    const [tags] = await connection.execute<MemoTagRow[]>(
      'SELECT tag FROM memo_tags WHERE memo_id = ?',
      [id]
    );
    
    const memoTags = tags.map(tag => tag.tag);
    
    return {
      id: memo.id,
      title: memo.title,
      content: memo.content,
      priority: memo.priority,
      tags: memoTags,
      createdAt: memo.created_at,
      updatedAt: memo.updated_at
    };
  } finally {
    connection.release();
  }
}

// 更新备忘录
export async function updateMemo(id: number, memo: Partial<Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Memo | null> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // 更新备忘录主记录
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    
    if (memo.title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(memo.title);
    }
    
    if (memo.content !== undefined) {
      updateFields.push('content = ?');
      updateValues.push(memo.content);
    }
    
    if (memo.priority !== undefined) {
      updateFields.push('priority = ?');
      updateValues.push(memo.priority);
    }
    
    if (updateFields.length > 0) {
      updateValues.push(id);
      await connection.execute(
        `UPDATE memos SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }
    
    // 更新标签
    if (memo.tags !== undefined) {
      // 删除现有标签
      await connection.execute(
        'DELETE FROM memo_tags WHERE memo_id = ?',
        [id]
      );
      
      // 插入新标签
      if (memo.tags.length > 0) {
        const tagValues = memo.tags.map(tag => [id, tag]);
        await connection.query(
          'INSERT INTO memo_tags (memo_id, tag) VALUES ?',
          [tagValues]
        );
      }
    }
    
    await connection.commit();
    
    // 返回更新后的备忘录
    return await getMemoById(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// 删除备忘录
export async function deleteMemo(id: number): Promise<boolean> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // 删除标签
    await connection.execute(
      'DELETE FROM memo_tags WHERE memo_id = ?',
      [id]
    );
    
    // 删除备忘录主记录
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM memos WHERE id = ?',
      [id]
    );
    
    await connection.commit();
    
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// 获取所有标签
export async function getAllTags(): Promise<string[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT DISTINCT tag FROM memo_tags ORDER BY tag'
  );
  
  return rows.map(row => row.tag as string);
}

// 根据搜索条件过滤备忘录
export async function searchMemos(searchTerm?: string, priority?: string, tag?: string): Promise<Memo[]> {
  const connection = await pool.getConnection();
  try {
    let query = 'SELECT * FROM memos';
    let params: any[] = [];
    
    // 构建查询条件
    const conditions: string[] = [];
    
    if (searchTerm) {
      conditions.push('(title LIKE ? OR content LIKE ?)');
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }
    
    if (priority && priority !== 'all') {
      conditions.push('priority = ?');
      params.push(priority);
    }
    
    if (tag) {
      query = `
        SELECT m.* FROM memos m
        JOIN memo_tags mt ON m.id = mt.memo_id
        WHERE mt.tag = ?
      `;
      params = [tag];
      
      if (searchTerm) {
        query += ' AND (m.title LIKE ? OR m.content LIKE ?)';
        params.push(`%${searchTerm}%`, `%${searchTerm}%`);
      }
      
      if (priority && priority !== 'all') {
        query += ' AND m.priority = ?';
        params.push(priority);
      }
      
      query += ' ORDER BY m.updated_at DESC';
    } else {
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      query += ' ORDER BY updated_at DESC';
    }
    
    // 获取备忘录主记录
    const [memos] = await connection.execute<MemoRow[]>(query, params);
    
    // 获取所有标签
    const [tags] = await connection.execute<MemoTagRow[]>(
      'SELECT * FROM memo_tags'
    );
    
    // 构建备忘录对象
    return memos.map(memo => {
      const memoTags = tags
        .filter(tag => tag.memo_id === memo.id)
        .map(tag => tag.tag);
      
      return {
        id: memo.id,
        title: memo.title,
        content: memo.content,
        priority: memo.priority,
        tags: memoTags,
        createdAt: memo.created_at,
        updatedAt: memo.updated_at
      };
    });
  } finally {
    connection.release();
  }
}
```

## API路由实现

### 1. 获取备忘录列表 (src/app/api/memos/route.ts)

```typescript
import { NextResponse } from 'next/server';
import { getAllMemos, searchMemos } from '@/lib/memo-db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const tag = searchParams.get('tag') || undefined;
    
    let memos;
    if (searchTerm || priority || tag) {
      memos = await searchMemos(searchTerm, priority, tag);
    } else {
      memos = await getAllMemos();
    }
    
    return NextResponse.json({
      success: true,
      data: memos
    });
  } catch (error) {
    console.error('获取备忘录列表失败:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '获取备忘录列表失败'
      }
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, priority, tags } = body;
    
    // 验证必填字段
    if (!title || !content) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '标题和内容为必填字段'
        }
      }, { status: 400 });
    }
    
    // 创建备忘录
    const newMemo = await createMemo({
      title,
      content,
      priority,
      tags
    });
    
    return NextResponse.json({
      success: true,
      data: newMemo
    }, { status: 201 });
  } catch (error) {
    console.error('创建备忘录失败:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '创建备忘录失败'
      }
    }, { status: 500 });
  }
}
```

### 2. 获取单个备忘录 (src/app/api/memos/[id]/route.ts)

```typescript
import { NextResponse } from 'next/server';
import { getMemoById, updateMemo, deleteMemo } from '@/lib/memo-db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    
    // 验证ID参数
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '无效的备忘录ID'
        }
      }, { status: 400 });
    }
    
    // 获取备忘录
    const memo = await getMemoById(id);
    
    if (!memo) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MEMO_NOT_FOUND',
          message: '备忘录不存在'
        }
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: memo
    });
  } catch (error) {
    console.error('获取备忘录失败:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '获取备忘录失败'
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
          message: '无效的备忘录ID'
        }
      }, { status: 400 });
    }
    
    // 检查备忘录是否存在
    const existingMemo = await getMemoById(id);
    if (!existingMemo) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MEMO_NOT_FOUND',
          message: '备忘录不存在'
        }
      }, { status: 404 });
    }
    
    // 获取更新数据
    const body = await request.json();
    const { title, content, priority, tags } = body;
    
    // 更新备忘录
    const updatedMemo = await updateMemo(id, {
      title,
      content,
      priority,
      tags
    });
    
    return NextResponse.json({
      success: true,
      data: updatedMemo
    });
  } catch (error) {
    console.error('更新备忘录失败:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '更新备忘录失败'
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
          message: '无效的备忘录ID'
        }
      }, { status: 400 });
    }
    
    // 删除备忘录
    const deleted = await deleteMemo(id);
    
    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MEMO_NOT_FOUND',
          message: '备忘录不存在'
        }
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: '备忘录删除成功'
    });
  } catch (error) {
    console.error('删除备忘录失败:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '删除备忘录失败'
      }
    }, { status: 500 });
  }
}
```

### 3. 获取所有标签 (src/app/api/memos/tags/route.ts)

```typescript
import { NextResponse } from 'next/server';
import { getAllTags } from '@/lib/memo-db';

export async function GET() {
  try {
    const tags = await getAllTags();
    
    return NextResponse.json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('获取标签列表失败:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '获取标签列表失败'
      }
    }, { status: 500 });
  }
}
```

## 错误处理和验证

### 输入验证中间件 (src/lib/validation.ts)

```typescript
// 验证备忘录数据
export function validateMemoData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.title) {
    errors.push('标题为必填字段');
  } else if (typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('标题必须为非空字符串');
  }
  
  if (!data.content) {
    errors.push('内容为必填字段');
  } else if (typeof data.content !== 'string' || data.content.trim().length === 0) {
    errors.push('内容必须为非空字符串');
  }
  
  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.push('优先级必须为 low、medium 或 high');
  }
  
  if (data.tags && !Array.isArray(data.tags)) {
    errors.push('标签必须为数组');
  } else if (data.tags) {
    for (const tag of data.tags) {
      if (typeof tag !== 'string' || tag.trim().length === 0) {
        errors.push('标签必须为非空字符串');
        break;
      }
    }
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

### 创建备忘录
```bash
curl -X POST http://localhost:3000/api/memos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "会议记录",
    "content": "今天与客户讨论了项目需求...",
    "priority": "high",
    "tags": ["工作", "会议"]
  }'
```

### 获取备忘录列表
```bash
curl http://localhost:3000/api/memos
```

### 根据条件搜索备忘录
```bash
curl "http://localhost:3000/api/memos?search=会议&priority=high"
```

### 获取单个备忘录
```bash
curl http://localhost:3000/api/memos/1
```

### 更新备忘录
```bash
curl -X PUT http://localhost:3000/api/memos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新后的会议记录",
    "content": "今天与客户详细讨论了项目需求...",
    "priority": "medium"
  }'
```

### 删除备忘录
```bash
curl -X DELETE http://localhost:3000/api/memos/1
```

### 获取所有标签
```bash
curl http://localhost:3000/api/memos/tags