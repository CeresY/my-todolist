# docker发布
## 方式一：使用docker-compose发布

## 方式二：通过docker-run启动

step1: 创建dockerfile

step2: 构建镜像
```docker
# 在项目目录下构建镜像
docker build -t mytodo:latest .

# 或者指定构建上下文
docker build -t mytodo:latest -f Dockerfile .
```
step3: 启动镜像
```docker
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.example.com \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e NEXTAUTH_SECRET=your-secret-key \
  mytodo:latest
```

# AI启动建议
## NEXT_PUBLIC_API_URL 的来源解析

在这个 docker-compose.yml 中，`NEXT_PUBLIC_API_URL` 的值有以下几个来源：

### 🔍 **主要来源：宿主机环境变量**

```yaml
environment:
  - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
```

这里的 `${NEXT_PUBLIC_API_URL}` 是**从运行 docker-compose 命令的宿主机的环境变量中读取的**。

### 📋 **完整的环境变量加载优先级**

| 优先级 | 来源 | 说明 |
|--------|------|------|
| **1** | `environment` 属性 | 宿主机环境变量（最高优先级） |
| **2** | `env_file` 属性 | `.env.production` 文件 |
| **3** | Dockerfile 中的 `ENV` | 硬编码在镜像中 |

### 🛠️ **如何设置 NEXT_PUBLIC_API_URL**

#### **方法 1：宿主机环境变量（推荐）**

```bash
# 在运行 docker-compose 前设置环境变量
export NEXT_PUBLIC_API_URL=https://api.example.com
export DATABASE_URL=postgresql://user:pass@host:5432/db
export NEXTAUTH_SECRET=your-secret-key

# 然后启动服务
docker-compose up -d
```

#### **方法 2：.env 文件**

在项目根目录创建 `.env` 文件（**注意：不是 `.env.production`**）：

```bash
# .env 文件
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://user:pass@host:5432/db
NEXTAUTH_SECRET=your-secret-key
```

#### **方法 3：docker-compose 命令行**

```bash
docker-compose up -d \
  -e NEXT_PUBLIC_API_URL=https://api.example.com \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e NEXTAUTH_SECRET=your-secret-key
```

#### **方法 4：docker-compose.yml 直接配置**

```yaml
version: '3.8'
services:
  app:
    image: your-app:latest
    environment:
      # 直接硬编码（不推荐用于生产）
      - NEXT_PUBLIC_API_URL=https://api.example.com
      - DATABASE_URL=postgresql://user:pass@host:5432/db
      - NEXTAUTH_SECRET=your-secret-key
    ports:
      - "3000:3000"
```

### 🚨 **重要注意事项**

1. **环境变量命名**：
   - `NEXT_PUBLIC_` 前缀的变量会暴露给客户端
   - 其他变量（如 `DATABASE_URL`）只在服务端可用

2. **安全建议**：
   ```yaml
   # 敏感信息建议使用 Docker Secrets
   secrets:
     - db_password
     - api_key
   ```

3. **不同环境配置**：
   ```bash
   # 开发环境
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

   # 生产环境
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
   ```

### 📁 **推荐的项目结构**

```
project/
├── .env                 # 本地开发环境变量
├── .env.production      # 生产环境变量模板
├── .env.example        # 环境变量示例
├── docker-compose.yml
├── docker-compose.prod.yml
└── Dockerfile
```

### 🔧 **最佳实践总结**

1. **开发环境**：使用 `.env` 文件
2. **生产环境**：使用 CI/CD 系统注入环境变量
3. **敏感信息**：使用 Docker Secrets 或 Kubernetes Secrets
4. **配置管理**：为不同环境创建不同的 docker-compose 配置文件

这样既保证了安全性，又提供了灵活的配置管理方式。