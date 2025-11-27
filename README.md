# Node.js 第三方 API 代理示例

本项目演示如何用 Node.js（Express）调取第三方 API，并通过后端代理方式解决前端常见的跨域（CORS）限制。

## 快速开始

```bash
npm install
cp env.example .env   # Windows 可手动复制
npm run dev
```

服务器默认在 `http://localhost:5000` 运行。

## 环境变量

参考 `env.example`：

- `PORT`：本地服务端口。
- `THIRD_PARTY_BASE`：目标第三方 API 基地址，默认使用 JSONPlaceholder。
- `CORS_ORIGINS`：允许访问的前端来源，支持逗号分隔，`*` 表示全部允许。

## 核心功能

- `/health`：健康检查。
- `/api/posts`：代理第三方 API，可通过 `?id=` 指定单个资源。例如：
  - `http://localhost:5000/api/posts` → 获取全部数据。
  - `http://localhost:5000/api/posts?id=1` → 获取 ID 为 1 的资源。

由于请求由服务器发起，浏览器不再直接访问第三方域名，从而避免跨域限制。同时使用 `cors` 中间件设置允许的来源，确保自有 API 可被前端安全调用。

## 生产部署提示

- 将 `.env` 中的敏感配置保存在安全的配置中心。
- 根据需求增加缓存、鉴权和错误重试。
- 可配合 `pm2`、Docker 等进行部署和进程守护。

