import pool from './db';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { Memo } from '@/types';

// 数据库行数据类型定义
interface MemoRow extends RowDataPacket {
  id: number;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  tags: string | null;
  created_at: Date;
  updated_at: Date;
}

// 创建备忘录
export async function createMemo(memo: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Memo> {
  const { title, content, priority = 'medium', tags = [] } = memo;
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // 插入备忘录主记录
    const [result] = await connection.execute<ResultSetHeader>(
      'INSERT INTO memos (title, content, priority, tags) VALUES (?, ?, ?, ?)',
      [title, content, priority, JSON.stringify(tags)]
    );
    
    const memoId = result.insertId;
    const createdAt = new Date();
    const updatedAt = new Date();
    
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
  const [rows] = await pool.execute<MemoRow[]>(
    'SELECT * FROM memos ORDER BY updated_at DESC'
  );
  console.log('获取备忘录列表:', rows);
  return rows.map(row => ({
    id: row.id,
    title: row.title,
    content: row.content,
    priority: row.priority,
    tags: Array.isArray(row.tags) ? row.tags : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

// 根据ID获取备忘录
export async function getMemoById(id: number): Promise<Memo | null> {
  const [rows] = await pool.execute<MemoRow[]>(
    'SELECT * FROM memos WHERE id = ?',
    [id]
  );
  
  if (rows.length === 0) {
    return null;
  }
  
  const row = rows[0];
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    priority: row.priority,
    tags: Array.isArray(row.tags) ? row.tags : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// 更新备忘录
export async function updateMemo(id: number, memo: Partial<Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Memo | null> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // 构建更新字段
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
    
    if (memo.tags !== undefined) {
      updateFields.push('tags = ?');
      updateValues.push(JSON.stringify(memo.tags));
    }
    
    if (updateFields.length > 0) {
      updateValues.push(id);
      await connection.execute(
        `UPDATE memos SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`,
        updateValues
      );
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
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM memos WHERE id = ?',
    [id]
  );
  
  return result.affectedRows > 0;
}

// 根据搜索条件过滤备忘录
export async function searchMemos(searchTerm?: string, priority?: string, tag?: string): Promise<Memo[]> {
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
    conditions.push('JSON_CONTAINS(tags, ?)');
    params.push(JSON.stringify(tag));
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  query += ' ORDER BY updated_at DESC';
  
  const [rows] = await pool.execute<MemoRow[]>(query, params);
  
  return rows.map(row => ({
    id: row.id,
    title: row.title,
    content: row.content,
    priority: row.priority,
    tags: row.tags && row.tags.trim() !== '' ? JSON.parse(row.tags) : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}