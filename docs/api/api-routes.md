# API路由结构设计文档

## 概述
本文档描述了备忘录应用的Next.js API路由结构设计，包括路由路径、HTTP方法、请求参数和响应格式。

## 路由结构

### 1. 待办事项API路由 (src/app/api/todos)

#### 获取待办事项列表
- **路径**: `/api/todos`
- **方法**: GET
- **查询参数**:
  - `filter` (可选): 过滤条件，可选值为 `all` (默认)、`active`、`completed`
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "title": "待办事项标题",
        "completed": false,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

#### 创建待办事项
- **路径**: `/api/todos`
- **方法**: POST
- **请求体**:
  ```json
  {
    "title": "待办事项标题"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "待办事项标题",
      "completed": false,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

#### 更新待办事项
- **路径**: `/api/todos/[id]`
- **方法**: PUT
- **路径参数**:
  - `id`: 待办事项ID
- **请求体**:
  ```json
  {
    "title": "更新后的待办事项标题",
    "completed": true
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "更新后的待办事项标题",
      "completed": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

#### 删除待办事项
- **路径**: `/api/todos/[id]`
- **方法**: DELETE
- **路径参数**:
  - `id`: 待办事项ID
- **响应**:
  ```json
  {
    "success": true,
    "message": "待办事项删除成功"
  }
  ```

#### 切换待办事项完成状态
- **路径**: `/api/todos/[id]/toggle`
- **方法**: PATCH
- **路径参数**:
  - `id`: 待办事项ID
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "待办事项标题",
      "completed": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### 2. 备忘录API路由 (src/app/api/memos)

#### 获取备忘录列表
- **路径**: `/api/memos`
- **方法**: GET
- **查询参数**:
  - `search` (可选): 搜索关键词
  - `priority` (可选): 优先级过滤，可选值为 `all` (默认)、`low`、`medium`、`high`
  - `tag` (可选): 标签过滤
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "title": "备忘录标题",
        "content": "备忘录内容",
        "priority": "medium",
        "tags": ["工作", "重要"],
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

#### 创建备忘录
- **路径**: `/api/memos`
- **方法**: POST
- **请求体**:
  ```json
  {
    "title": "备忘录标题",
    "content": "备忘录内容",
    "priority": "medium",
    "tags": ["工作", "重要"]
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "备忘录标题",
      "content": "备忘录内容",
      "priority": "medium",
      "tags": ["工作", "重要"],
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

#### 获取单个备忘录
- **路径**: `/api/memos/[id]`
- **方法**: GET
- **路径参数**:
  - `id`: 备忘录ID
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "备忘录标题",
      "content": "备忘录内容",
      "priority": "medium",
      "tags": ["工作", "重要"],
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

#### 更新备忘录
- **路径**: `/api/memos/[id]`
- **方法**: PUT
- **路径参数**:
  - `id`: 备忘录ID
- **请求体**:
  ```json
  {
    "title": "更新后的备忘录标题",
    "content": "更新后的备忘录内容",
    "priority": "high",
    "tags": ["工作", "重要", "紧急"]
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "更新后的备忘录标题",
      "content": "更新后的备忘录内容",
      "priority": "high",
      "tags": ["工作", "重要", "紧急"],
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

#### 删除备忘录
- **路径**: `/api/memos/[id]`
- **方法**: DELETE
- **路径参数**:
  - `id`: 备忘录ID
- **响应**:
  ```json
  {
    "success": true,
    "message": "备忘录删除成功"
  }
  ```

#### 获取所有标签
- **路径**: `/api/memos/tags`
- **方法**: GET
- **响应**:
  ```json
  {
    "success": true,
    "data": ["工作", "重要", "紧急", "个人"]
  }
  ```

## 错误响应格式

所有API在发生错误时都会返回以下格式的响应：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述信息"
  }
}
```

常见的错误码：
- `TODO_NOT_FOUND`: 待办事项未找到
- `MEMO_NOT_FOUND`: 备忘录未找到
- `INVALID_INPUT`: 输入参数无效
- `DATABASE_ERROR`: 数据库操作错误

## 认证与授权

当前版本的API不包含认证与授权机制。在生产环境中，建议添加JWT Token或Session-based认证来保护API。

## 限流与安全

建议在生产环境中实施以下安全措施：
1. API请求限流
2. 输入验证和清理
3. SQL注入防护
4. CORS配置