import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

export async function GET() {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT DISTINCT tags FROM memos WHERE tags IS NOT NULL AND tags != "[]"'
    );
    
    // 提取所有标签
    const tagSet = new Set<string>();
    rows.forEach(row => {
      const tags = JSON.parse(row.tags as string);
      if (Array.isArray(tags)) {
        tags.forEach(tag => tagSet.add(tag));
      }
    });
    
    const tags = Array.from(tagSet).sort();
    
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