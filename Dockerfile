# ======================================================================================
# Stage 1: DEPS - 安装所有依赖 (包括开发依赖)
#
# 这一阶段的目标是利用 Docker 缓存机制。只要 lock 文件不变，就不需要重新安装依赖。
# 这里需要安装所有依赖，因为 `pnpm build` 可能需要 `devDependencies` (例如 typescript)。
# ======================================================================================
FROM node:22-alpine AS deps
WORKDIR /app

# 只复制依赖定义文件
COPY package.json pnpm-lock.yaml* ./

# 安装所有依赖
RUN pnpm install --frozen-lockfile


# ======================================================================================
# Stage 2: BUILDER - 构建应用程序
#
# 这一阶段负责编译源代码，生成生产环境可用的代码 (.next 文件夹)。
# ======================================================================================
FROM node:22-alpine AS builder
WORKDIR /app

# 从 'deps' 阶段复制已经安装好的 node_modules
COPY --from=deps /app/node_modules ./node_modules
# 复制所有项目文件 (利用 .dockerignore 排除不必要的文件)
COPY . .

# 设置构建时需要的环境变量 (如果你的构建过程需要)
# ENV NEXT_PUBLIC_API_URL=https://api.example.com

# 执行构建命令
RUN pnpm build


# ======================================================================================
# Stage 3: RUNNER - 运行最终的应用 (已优化)
#
# 这是最终的生产镜像。它必须尽可能小和安全。
# 关键优化：我们不再从 builder 复制庞大的 node_modules，
# 而是根据 package.json 只安装生产环境必需的依赖。
# ======================================================================================
FROM node:22-alpine AS runner
WORKDIR /app

# 设置环境变量为生产模式，这对 Next.js 的性能至关重要
ENV NODE_ENV=production

# 从 'builder' 阶段复制 package.json 和 lock 文件
COPY --from=builder /app/package.json /app/pnpm-lock.yaml* ./

# --- 核心优化点 ---
# 只安装生产依赖 (`dependencies`)，忽略 `devDependencies`
# 这会创建一个体积小得多的 node_modules 文件夹
RUN pnpm install --prod --frozen-lockfile

# 从 'builder' 阶段复制构建产物和公共静态文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# 暴露应用程序运行的端口
EXPOSE 3000

# 容器启动时执行的命令
CMD ["pnpm", "start"]