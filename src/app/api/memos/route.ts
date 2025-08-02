import { NextResponse } from 'next/server';
import { getAllMemos, searchMemos, createMemo } from '@/lib/memo-db';

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