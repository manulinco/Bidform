# 🚀 部署指南

## GitHub 推送步骤

### 1. 创建 GitHub 仓库
1. 访问 https://github.com/new
2. 仓库名: `bidform`
3. 描述: `Embedded bid forms with Stripe split payments`
4. 设置为公开
5. 不要初始化 README
6. 点击 "Create repository"

### 2. 设置身份验证

#### 方法 A: 个人访问令牌 (推荐)
1. 访问 GitHub Settings > Developer settings > Personal access tokens
2. 生成新令牌，选择 `repo` 权限
3. 复制令牌
4. 推送时使用令牌作为密码

#### 方法 B: SSH 密钥
```bash
# 生成 SSH 密钥
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 添加到 GitHub
# 复制公钥内容到 GitHub Settings > SSH Keys
```

### 3. 推送命令
```bash
# 如果仓库已创建，直接推送
git push -u origin main

# 如果需要强制推送（小心使用）
git push -u origin main --force
```

### 4. 验证推送
访问 https://github.com/manulinco/bidform 确认文件已上传

## 部署到 Vercel

### 1. 连接 GitHub
1. 访问 https://vercel.com
2. 使用 GitHub 登录
3. 导入 `bidform` 仓库

### 2. 环境变量设置
在 Vercel 项目设置中添加：
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### 3. 部署
- Vercel 会自动检测 Vite 项目
- 构建命令: `npm run build`
- 输出目录: `dist`
- 点击部署

## 部署到 Netlify

### 1. 连接 GitHub
1. 访问 https://netlify.com
2. 点击 "New site from Git"
3. 选择 GitHub 并授权
4. 选择 `bidform` 仓库

### 2. 构建设置
- 构建命令: `npm run build`
- 发布目录: `dist`
- 环境变量同上

### 3. 自定义域名
在 Netlify 设置中可以添加自定义域名 `bidform.online`

## 环境变量说明

```bash
# Supabase 配置
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe 配置  
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 数据库设置

### Supabase 设置
1. 创建新项目: https://supabase.com
2. 运行 SQL 脚本（见 README.md）
3. 配置 OAuth 提供商
4. 获取 API 密钥

### Stripe 设置
1. 创建 Stripe 账户: https://stripe.com
2. 获取 API 密钥
3. 设置 Webhook 端点
4. 配置 Stripe Connect

## 域名配置

### DNS 设置
```
A     @     76.76.19.61 (Vercel)
CNAME www   bidform.online
```

### SSL 证书
- Vercel/Netlify 自动提供 SSL
- 自定义域名会自动获得证书

## 监控和分析

### 推荐工具
- **错误监控**: Sentry
- **分析**: Google Analytics 4
- **性能**: Vercel Analytics
- **正常运行时间**: UptimeRobot

## 备份策略

### 代码备份
- GitHub 作为主要代码仓库
- 定期创建 release 标签

### 数据库备份
- Supabase 自动备份
- 定期导出重要数据

### 配置备份
- 环境变量文档化
- 部署配置版本控制