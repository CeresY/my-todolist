# API测试指南

## 概述
本文档提供了测试Next.js备忘录应用后端API的详细指南，包括测试环境设置、测试用例和测试步骤。

## 测试环境准备

### 1. 数据库设置
确保MySQL数据库已安装并运行，创建测试数据库：
```sql
CREATE DATABASE memo_app_test;
CREATE USER 'memo_test_user'@'localhost' IDENTIFIED BY 'memo_test_password';
GRANT ALL PRIVILEGES ON memo_app_test.* TO 'memo_test_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. 数据库表创建
在测试数据库中创建所需的表：
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
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建memo_tags表
CREATE TABLE memo_tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  memo_id INT NOT NULL,
  tag VARCHAR(50) NOT NULL,
  FOREIGN KEY (memo_id) REFERENCES memos(id) ON DELETE CASCADE,
  INDEX idx_memo_id (memo_id),
  INDEX idx_tag (tag)
);
```

### 3. 环境变量配置
创建`.env.test`文件用于测试环境：
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=memo_test_user
DB_PASSWORD=memo_test_password
DB_NAME=memo_app_test
DB_CONNECTION_LIMIT=5
```

## 测试工具

### 1. curl命令行工具
适用于快速测试API端点。

### 2. Postman
提供图形化界面，便于复杂测试场景。

### 3. Jest + Supertest
用于自动化测试。

## 待办事项API测试

### 测试用例1: 创建待办事项
**请求**:
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试待办事项"
  }'
```

**预期响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "测试待办事项",
    "completed": false,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 测试用例2: 获取待办事项列表
**请求**:
```bash
curl http://localhost:3000/api/todos
```

**预期响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "测试待办事项",
      "completed": false,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### 测试用例3: 获取未完成的待办事项
**请求**:
```bash
curl "http://localhost:3000/api/todos?filter=active"
```

**预期响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "测试待办事项",
      "completed": false,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### 测试用例4: 获取已完成的待办事项
**请求**:
```bash
curl "http://localhost:3000/api/todos?filter=completed"
```

**预期响应**:
```json
{
  "success": true,
  "data": []
}
```

### 测试用例5: 获取单个待办事项
**请求**:
```bash
curl http://localhost:3000/api/todos/1
```

**预期响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "测试待办事项",
    "completed": false,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 测试用例6: 更新待办事项
**请求**:
```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新后的测试待办事项",
    "completed": true
  }'
```

**预期响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "更新后的测试待办事项",
    "completed": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 测试用例7: 切换待办事项完成状态
**请求**:
```bash
curl -X PATCH http://localhost:3000/api/todos/1/toggle
```

**预期响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "更新后的测试待办事项",
    "completed": false,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 测试用例8: 删除待办事项
**请求**:
```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

**预期响应**:
```json
{
  "success": true,
  "message": "待办事项删除成功"
}
```

### 测试用例9: 获取不存在的待办事项
**请求**:
```bash
curl http://localhost:3000/api/todos/999
```

**预期响应**:
```json
{
  "success": false,
  "error": {
    "code": "TODO_NOT_FOUND",
    "message": "待办事项不存在"
  }
}
```

### 测试用例10: 创建待办事项时缺少标题
**请求**:
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{}'
```

**预期响应**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "标题为必填字段"
  }
}
```

## 备忘录API测试

### 测试用例1: 创建备忘录
**请求**:
```bash
curl -X POST http://localhost:3000/api/memos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试备忘录",
    "content": "这是一个测试备忘录",
    "priority": "medium",
    "tags": ["测试", "开发"]
  }'
```

**预期响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "测试备忘录",
    "content": "这是一个测试备忘录",
    "priority": "medium",
    "tags": ["测试", "开发"],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 测试用例2: 获取备忘录列表
**请求**:
```bash
curl http://localhost:3000/api/memos
```

**预期响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "测试备忘录",
      "content": "这是一个测试备忘录",
      "priority": "medium",
      "tags": ["测试", "开发"],
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### 测试用例3: 搜索备忘录
**请求**:
```bash
curl "http://localhost:3000/api/memos?search=测试"
```

**预期响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "测试备忘录",
      "content": "这是一个测试备忘录",
      "priority": "medium",
      "tags": ["测试", "开发"],
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### 测试用例4: 根据优先级过滤备忘录
**请求**:
```bash
curl "http://localhost:3000/api/memos?priority=medium"
```

**预期响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "测试备忘录",
      "content": "这是一个测试备忘录",
      "priority": "medium",
      "tags": ["测试", "开发"],
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### 测试用例5: 根据标签过滤备忘录
**请求**:
```bash
curl "http://localhost:3000/api/memos?tag=测试"
```

**预期响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "测试备忘录",
      "content": "这是一个测试备忘录",
      "priority": "medium",
      "tags": ["测试", "开发"],
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### 测试用例6: 获取单个备忘录
**请求**:
```bash
curl http://localhost:3000/api/memos/1
```

**预期响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "测试备忘录",
    "content": "这是一个测试备忘录",
    "priority": "medium",
    "tags": ["测试", "开发"],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 测试用例7: 更新备忘录
**请求**:
```bash
curl -X PUT http://localhost:3000/api/memos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新后的测试备忘录",
    "content": "这是更新后的测试备忘录",
    "priority": "high"
  }'
```

**预期响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "更新后的测试备忘录",
    "content": "这是更新后的测试备忘录",
    "priority": "high",
    "tags": ["测试", "开发"],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 测试用例8: 删除备忘录
**请求**:
```bash
curl -X DELETE http://localhost:3000/api/memos/1
```

**预期响应**:
```json
{
  "success": true,
  "message": "备忘录删除成功"
}
```

### 测试用例9: 获取所有标签
**请求**:
```bash
curl http://localhost:3000/api/memos/tags
```

**预期响应**:
```json
{
  "success": true,
  "data": ["测试", "开发"]
}
```

### 测试用例10: 获取不存在的备忘录
**请求**:
```bash
curl http://localhost:3000/api/memos/999
```

**预期响应**:
```json
{
  "success": false,
  "error": {
    "code": "MEMO_NOT_FOUND",
    "message": "备忘录不存在"
  }
}
```

## 错误测试用例

### 测试用例1: 无效的待办事项ID
**请求**:
```bash
curl http://localhost:3000/api/todos/invalid
```

**预期响应**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "无效的待办事项ID"
  }
}
```

### 测试用例2: 无效的备忘录ID
**请求**:
```bash
curl http://localhost:3000/api/memos/invalid
```

**预期响应**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "无效的备忘录ID"
  }
}
```

### 测试用例3: 数据库连接错误
模拟数据库连接失败的情况，确保API返回适当的错误响应。

## 自动化测试

### 使用Jest和Supertest进行测试
创建测试文件 `__tests__/api.test.ts`:

```typescript
import { test, expect } from '@jest/globals';
import request from 'supertest';
import app from '../src/app'; // 假设你的Next.js应用入口

describe('待办事项API', () => {
  test('应该创建新的待办事项', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({
        title: '测试待办事项'
      })
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('测试待办事项');
    expect(response.body.data.completed).toBe(false);
  });

  test('应该获取待办事项列表', async () => {
    const response = await request(app)
      .get('/api/todos')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

describe('备忘录API', () => {
  test('应该创建新的备忘录', async () => {
    const response = await request(app)
      .post('/api/memos')
      .send({
        title: '测试备忘录',
        content: '这是一个测试备忘录',
        priority: 'medium',
        tags: ['测试', '开发']
      })
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('测试备忘录');
    expect(response.body.data.tags).toEqual(['测试', '开发']);
  });

  test('应该获取备忘录列表', async () => {
    const response = await request(app)
      .get('/api/memos')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

## 测试执行步骤

### 1. 启动开发服务器
```bash
npm run dev
```

### 2. 执行手动测试
按照上述测试用例逐一执行测试。

### 3. 执行自动化测试
```bash
npm test
```

## 测试结果验证

### 成功标准
1. 所有API端点返回正确的HTTP状态码
2. 响应数据格式符合预期
3. 数据库中的记录正确创建、更新和删除
4. 错误情况返回适当的错误信息

### 失败处理
1. 记录失败的测试用例
2. 检查API实现代码
3. 验证数据库连接和查询
4. 修复问题后重新测试

## 性能测试

### 并发测试
使用工具如Apache Bench进行并发请求测试：
```bash
ab -n 1000 -c 100 http://localhost:3000/api/todos
```

### 响应时间监控
确保API响应时间在可接受范围内：
- 简单查询：< 100ms
- 复杂查询：< 500ms
- 数据库写入操作：< 200ms

## 安全测试

### SQL注入测试
尝试在请求参数中注入SQL代码，确保API能正确处理。

### XSS测试
在输入字段中尝试注入脚本代码，确保API返回的数据经过适当的转义处理。

## 测试报告

### 测试覆盖率
确保API测试覆盖以下方面：
- 所有HTTP方法
- 所有路由端点
- 正常流程和异常流程
- 边界条件和错误处理

### 测试结果记录
记录每次测试的结果，包括：
- 测试日期和时间
- 测试环境信息
- 通过的测试用例
- 失败的测试用例及原因
- 性能指标