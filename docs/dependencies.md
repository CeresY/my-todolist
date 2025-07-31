# 项目依赖文档

## 需要安装的MySQL相关依赖

为了实现Next.js后端API服务与MySQL数据库的连接，需要安装以下依赖包：

### 生产依赖
1. `mysql2` - 用于连接MySQL数据库的Node.js驱动
2. `dotenv` - 用于管理环境变量

### 开发依赖
1. `@types/mysql2` - MySQL2的TypeScript类型定义（如果需要）

## 安装命令

```bash
npm install mysql2 dotenv
```

或者使用yarn：

```bash
yarn add mysql2 dotenv
```

## 依赖说明

### mysql2
- 这是mysql包的改进版本，提供了更好的性能和更多功能
- 支持Promise API，便于在Next.js API路由中使用
- 提供了连接池功能，可以有效管理数据库连接

### dotenv
- 用于从.env文件加载环境变量
- 可以安全地存储数据库连接信息，避免敏感信息泄露