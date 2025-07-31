# API文档

## 概述
本文档详细描述了备忘录应用的RESTful API接口，包括待办事项和备忘录的CRUD操作。

## 基础URL
所有API端点都以以下基础URL开头：
```
http://localhost:3000/api
```

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": {}
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述信息"
  }
}
```

## 待办事项API

### 获取待办事项列表
- **URL**: `/todos`
- **方法**: GET
- **查询参数**:
  - `filter` (可选): 过滤条件
    - `all`: 所有待办事项（默认）
    - `active`: 未完成的待办事项
    - `completed`: 已完成的待办事项
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

### 创建待办事项
- **URL**: `/todos`
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

### 获取单个待办事项
- **URL**: `/todos/{id}`
- **方法**: GET
- **路径参数**:
  - `id`: 待办事项ID
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

### 更新待办事项
- **URL**: `/todos/{id}`
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

### 删除待办事项
- **URL**: `/todos/{id}`
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

### 切换待办事项完成状态
- **URL**: `/todos/{id}/toggle`
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

## 备忘录API

### 获取备忘录列表
- **URL**: `/memos`
- **方法**: GET
- **查询参数**:
  - `search` (可选): 搜索关键词
  - `priority` (可选): 优先级过滤
    - `all`: 所有优先级（默认）
    - `low`: 低优先级
    - `medium`: 中优先级
    - `high`: 高优先级
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

### 创建备忘录
- **URL**: `/memos`
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

### 获取单个备忘录
- **URL**: `/memos/{id}`
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

### 更新备忘录
- **URL**: `/memos/{id}`
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

### 删除备忘录
- **URL**: `/memos/{id}`
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

### 获取所有标签
- **URL**: `/memos/tags`
- **方法**: GET
- **响应**:
  ```json
  {
    "success": true,
    "data": ["工作", "重要", "紧急", "个人"]
  }
  ```

## 错误码说明

| 错误码 | 描述 |
|--------|------|
| TODO_NOT_FOUND | 待办事项未找到 |
| MEMO_NOT_FOUND | 备忘录未找到 |
| INVALID_INPUT | 输入参数无效 |
| DATABASE_ERROR | 数据库操作错误 |

## 使用示例

### 创建待办事项
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "完成项目文档"
  }'
```

### 获取所有备忘录
```bash
curl http://localhost:3000/api/memos
```

### 根据标签搜索备忘录
```bash
curl "http://localhost:3000/api/memos?tag=工作"
```

### 更新备忘录
```bash
curl -X PUT http://localhost:3000/api/memos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新后的标题",
    "content": "更新后的内容",
    "priority": "high"
  }'