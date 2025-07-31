# 数据库连接配置文档

## 环境变量配置

为了安全地管理数据库连接信息，我们将使用环境变量来存储敏感信息。需要在项目根目录创建一个`.env.local`文件（该文件不应被提交到版本控制系统中）。

### .env.local 文件内容
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

## 数据库连接配置说明

### 连接参数
- **DB_HOST**: 数据库服务器地址，默认为localhost
- **DB_PORT**: 数据库端口号，默认为3306
- **DB_USER**: 数据库用户名
- **DB_PASSWORD**: 数据库密码
- **DB_NAME**: 数据库名称

### 连接池参数
- **DB_CONNECTION_LIMIT**: 连接池最大连接数，默认为10

## 数据库连接实现

### 连接池配置 (src/lib/db.ts)
```typescript
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

// 测试连接函数
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('数据库连接成功');
    connection.release();
    return true;
  } catch (error) {
    console.error('数据库连接失败:', error);
    return false;
  }
}
```

## 配置文件使用说明

1. 在项目根目录创建`.env.local`文件，并填入正确的数据库连接信息
2. 确保`.env.local`文件已添加到`.gitignore`中，避免敏感信息泄露
3. 在需要数据库连接的API路由中导入`src/lib/db.ts`文件
4. 使用连接池执行数据库操作

## 安全注意事项

1. 永远不要将包含敏感信息的环境变量文件提交到版本控制系统
2. 在生产环境中，应使用服务器环境变量而非文件来配置敏感信息
3. 定期更换数据库密码，确保安全性
4. 限制数据库用户的权限，只授予必要的权限