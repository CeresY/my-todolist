import { NextResponse } from 'next/server';
import { getMemoById, updateMemo, deleteMemo } from '@/lib/memo-db';

// 根据ID获取备忘录
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: '无效的ID参数'
        }
      }, { status: 400 });
    }

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

// 更新备忘录
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: '无效的ID参数'
        }
      }, { status: 400 });
    }

    const body = await request.json();
    const { title, content, priority, tags } = body;

    // 验证必填字段
    if (title === undefined && content === undefined && priority === undefined && tags === undefined) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '至少提供一个要更新的字段'
        }
      }, { status: 400 });
    }

    // 更新备忘录
    const updatedMemo = await updateMemo(id, {
      title,
      content,
      priority,
      tags
    });

    if (!updatedMemo) {
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

// 删除备忘录
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: '无效的ID参数'
        }
      }, { status: 400 });
    }

    const result = await deleteMemo(id);
    if (!result) {
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