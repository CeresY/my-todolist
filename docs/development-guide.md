# Next.js备忘录应用后端API开发指南

## 目录
1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [数据库设计](#数据库设计)
4. [环境配置](#环境配置)
5. [API路由结构](#api路由结构)
6. [API接口文档](#api接口文档)
7. [开发步骤](#开发步骤)
8. [测试指南](#测试指南)

## 项目概述
本文档详细描述了如何为Next.js备忘录应用开发后端API服务，使用MySQL数据库实现数据持久化存储。该API服务提供待办事项和备忘录的完整CRUD操作。

## 技术栈
- **框架**: Next.js 14
- **数据库**: MySQL
- **数据库驱动**: mysql2
- **环境管理**: dotenv
- **类型检查**: TypeScript

## 数据库设计

### 待办事项表 (todos)
| 字段名 | 类型 | 约束 | 描述 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 待办事项唯一标识 |
| title | VARCHAR(255) | NOT NULL | 待办事项标题 |
| completed | BOOLEAN | NOT NULL, DEFAULT FALSE | 是否完成 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

### 备忘录表 (memos)
| 字段名 | 类型 | 约束 | 描述 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 备忘录唯一标识 |
| title | VARCHAR(255) | NOT NULL | 备忘录标题 |
| content | TEXT | NOT NULL | 备忘录内容 |
| priority | ENUM('low', 'medium', 'high') | DEFAULT 'medium' | 优先级 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

### 备忘录标签表 (memo_tags)
| 字段名 | 类型 | 约束 | 描述 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 标签唯一标识 |
| memo_id | INT | FOREIGN KEY REFERENCES memos(id) ON DELETE CASCADE | 关联的备忘录ID |
| tag | VARCHAR(50) | NOT NULL | 标签名称 |

## 环境配置

### 依赖安装
```bash
npm install mysql2 dotenv
```

### 环境变量配置
在项目根目录创建`.env.local`文件：
```env
# 数据库连接配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=memo_user
DB_PASSWORD=memo_password
DB_NAME=memo_app

# 连接池配置
DB_CONNECTION_LIMIT=10
```

### 数据库连接实现
```typescript
// src/lib/db.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 创建连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'memo_app',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
  acquireTimeout: 60000,
  timeout: 60000,
});

export default pool;
```

## API路由结构

### 待办事项API
- `GET /api/todos` - 获取待办事项列表
- `POST /api/todos` - 创建待办事项
- `GET /api/todos/[id]` - 获取单个待办事项
- `PUT /api/todos/[id]` - 更新待办事项
- `DELETE /api/todos/[id]` - 删除待办事项
- `PATCH /api/todos/[id]/toggle` - 切换待办事项完成状态

### 备忘录API
- `GET /api/memos` - 获取备忘录列表
- `POST /api/memos` - 创建备忘录
- `GET /api/memos/[id]` - 获取单个备忘录
- `PUT /api/memos/[id]` - 更新备忘录
- `DELETE /api/memos/[id]` - 删除备忘录
- `GET /api/memos/tags` - 获取所有标签

## API接口文档

### 待办事项接口

#### 获取待办事项列表
```http
GET /api/todos?filter=active
```

#### 创建待办事项
```http
POST /api/todos
Content-Type: application/json

{
  "title": "完成项目文档"
}
```

#### 更新待办事项
```http
PUT /api/todos/1
Content-Type: application/json

{
  "title": "更新后的任务标题",
  "completed": true
}
```

### 备忘录接口

#### 获取备忘录列表
```http
GET /api/memos?search=会议&priority=high
```

#### 创建备忘录
```http
POST /api/memos
Content-Type: application/json

{
  "title": "会议记录",
  "content": "今天与客户讨论了项目需求...",
  "priority": "high",
  "tags": ["工作", "会议"]
}
```

#### 更新备忘录
```http
PUT /api/memos/1
Content-Type: application/json

{
  "title": "更新后的会议记录",
  "content": "今天与客户详细讨论了项目需求...",
  "priority": "medium"
}
```

## 开发步骤

### 1. 数据库设置
1. 创建MySQL数据库和用户
2. 执行数据库表创建语句
3. 配置环境变量

### 2. 依赖安装
```bash
npm install mysql2 dotenv
```

### 3. 数据库连接配置
创建`src/lib/db.ts`文件并实现连接池

### 4. 数据库操作函数实现
- 创建`src/lib/todo-db.ts`实现待办事项数据库操作
- 创建`src/lib/memo-db.ts`实现备忘录数据库操作

### 5. API路由实现
- 实现待办事项API路由
- 实现备忘录API路由

### 6. 测试API接口
使用curl或Postman测试所有API端点

## 测试指南

### 待办事项API测试

#### 创建待办事项
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试待办事项"
  }'
```

#### 获取待办事项列表
```bash
curl http://localhost:3000/api/todos
```

#### 更新待办事项
```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新后的测试待办事项",
    "completed": true
  }'
```

#### 删除待办事项
```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

### 备忘录API测试

#### 创建备忘录
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

#### 获取备忘录列表
```bash
curl http://localhost:3000/api/memos
```

#### 搜索备忘录
```bash
curl "http://localhost:3000/api/memos?search=测试&priority=medium"
```

#### 更新备忘录
```bash
curl -X PUT http://localhost:3000/api/memos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新后的测试备忘录",
    "content": "这是更新后的测试备忘录",
    "priority": "high"
  }'
```

#### 删除备忘录
```bash
curl -X DELETE http://localhost:3000/api/memos/1
```

## 错误处理
所有API端点都包含适当的错误处理，返回统一的错误格式：
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述信息"
  }
}
```

常见错误码：
- `TODO_NOT_FOUND`: 待办事项未找到
- `MEMO_NOT_FOUND`: 备忘录未找到
- `INVALID_INPUT`: 输入参数无效
- `DATABASE_ERROR`: 数据库操作错误

## 安全建议
1. 在生产环境中使用HTTPS
2. 实施API请求限流
3. 添加认证和授权机制
4. 对用户输入进行验证和清理
5. 定期更新依赖包以修复安全漏洞