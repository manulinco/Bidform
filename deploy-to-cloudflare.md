# 🚀 BidForm.online - Cloudflare Pages 自动部署指南

## 📋 部署步骤

### 1. 推送最新代码到GitHub
```bash
git add .
git commit -m "Add Cloudflare Pages configuration"
git push origin main
```

### 2. 连接Cloudflare Pages
1. 访问 [Cloudflare Pages](https://pages.cloudflare.com/)
2. 点击 "Create a project"
3. 选择 "Connect to Git"
4. 选择 GitHub 仓库: `manulinco/Bidform`

### 3. 配置构建设置
```
项目名称: bidform-online
生产分支: main
构建命令: npm run build
构建输出目录: dist
根目录: /
Node.js 版本: 18
```

### 4. 环境变量设置
在 Cloudflare Pages 项目设置中添加：
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
NODE_ENV=production
```

### 5. 自定义域名配置
1. 在 Cloudflare Pages 项目中点击 "Custom domains"
2. 添加域名: `bidform.online`
3. 添加 www 重定向: `www.bidform.online`

## 🔧 DNS 配置

在你的域名注册商处设置：
```
类型    名称    内容
CNAME   @       bidform-online.pages.dev
CNAME   www     bidform-online.pages.dev
```

## ⚡ 自动部署触发

每次推送到 main 分支时，Cloudflare Pages 会自动：
1. 检测代码变更
2. 运行构建命令 `npm run build`
3. 部署到全球CDN
4. 更新 https://bidform.online

## 🚀 一键部署脚本

运行以下命令完成部署：
```bash
# 1. 提交并推送代码
git add .
git commit -m "Deploy to Cloudflare Pages"
git push origin main

# 2. 访问 Cloudflare Pages 完成设置
# https://pages.cloudflare.com/
```

## 📊 部署后验证

部署完成后检查：
- ✅ 网站可访问: https://bidform.online
- ✅ HTTPS 证书正常
- ✅ 全球CDN加速
- ✅ 自动部署工作正常

## 🔄 持续部署

之后的每次更新只需：
```bash
git add .
git commit -m "Update: 描述你的更改"
git push origin main
```

Cloudflare Pages 会自动检测并部署！