-- 创建数据库
CREATE DATABASE IF NOT EXISTS memo_app;

-- 使用数据库
USE memo_app;

-- 创建todos表
CREATE TABLE IF NOT EXISTS todos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建memos表
CREATE TABLE IF NOT EXISTS memos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  tags JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_todos_created_at ON todos(created_at);
CREATE INDEX idx_todos_updated_at ON todos(updated_at);
CREATE INDEX idx_memos_created_at ON memos(created_at);
CREATE INDEX idx_memos_updated_at ON memos(updated_at);
CREATE INDEX idx_memos_priority ON memos(priority);