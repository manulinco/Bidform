# 🚀 BidForm 项目 Cloudflare Pages 部署指南

## 📋 部署前准备清单

### ✅ 必需账户和权限
- [ ] Cloudflare 账户 (免费版即可)
- [ ] GitHub 账户 (已有仓库: manulinco/Bidform)
- [ ] Supabase 项目 (用于数据库和认证)
- [ ] Stripe 账户 (用于支付处理)

### ✅ 项目状态检查
- [x] 代码已推送到 GitHub
- [x] 构建测试通过 (`npm run build` 成功)
- [x] 环境变量配置文件已准备
- [x] Cloudflare 配置文件已存在

---

## 🎯 方法一：Cloudflare Dashboard 手动部署 (推荐新手)

### 步骤 1: 登录 Cloudflare Dashboard
1. 访问 https://dash.cloudflare.com
2. 登录你的 Cloudflare 账户
3. 如果没有账户，点击 "Sign Up" 免费注册

### 步骤 2: 创建 Pages 项目
1. 在左侧菜单点击 **"Pages"**
2. 点击 **"Create a project"** 按钮
3. 选择 **"Connect to Git"**
4. 点击 **"Connect GitHub"** 并授权访问
5. 在仓库列表中选择 **"manulinco/Bidform"**
6. 点击 **"Begin setup"**

### 步骤 3: 配置构建设置
```yaml
项目名称: bidform-app
生产分支: main
框架预设: Vite
构建命令: npm run build
构建输出目录: dist
根目录: / (保持默认)
```

### 步骤 4: 添加环境变量
在 "Environment variables" 部分添加以下变量：

**生产环境变量 (Production):**
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51...
NODE_ENV=production
```

**预览环境变量 (Preview - 可选):**
```bash
VITE_SUPABASE_URL=https://your-staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...
NODE_ENV=development
```

### 步骤 5: 开始部署
1. 点击 **"Save and Deploy"**
2. 等待构建完成 (通常 2-5 分钟)
3. 部署成功后会显示访问链接

---

## ⚡ 方法二：Wrangler CLI 快速部署 (推荐开发者)

### 安装 Wrangler CLI
```bash
npm install -g wrangler
```

### 登录 Cloudflare
```bash
wrangler login
```

### 创建 Pages 项目
```bash
wrangler pages project create bidform-app
```

### 构建并部署
```bash
# 构建项目
npm run build

# 部署到 Cloudflare Pages
wrangler pages deploy dist --project-name=bidform-app
```

### 设置环境变量
```bash
# 设置生产环境变量
wrangler pages secret put VITE_SUPABASE_URL --project-name=bidform-app
wrangler pages secret put VITE_SUPABASE_ANON_KEY --project-name=bidform-app
wrangler pages secret put VITE_STRIPE_PUBLISHABLE_KEY --project-name=bidform-app
```

---

## 🔧 环境变量获取指南

### Supabase 配置
1. 登录 https://supabase.com
2. 选择你的项目或创建新项目
3. 进入 **Settings > API**
4. 复制以下信息：
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

### Stripe 配置
1. 登录 https://dashboard.stripe.com
2. 进入 **Developers > API keys**
3. 复制 **Publishable key** → `VITE_STRIPE_PUBLISHABLE_KEY`
4. 注意：测试环境用 `pk_test_`，生产环境用 `pk_live_`

---

## 🌐 自定义域名设置 (可选)

### 添加自定义域名
1. 在 Cloudflare Pages 项目中点击 **"Custom domains"**
2. 点击 **"Set up a custom domain"**
3. 输入你的域名 (例如: `bidform.com`)
4. 按照提示配置 DNS 记录

### DNS 配置示例
```
类型: CNAME
名称: @
目标: bidform-app.pages.dev

类型: CNAME
名称: www
目标: bidform-app.pages.dev
```

---

## 🔄 自动部署设置

### GitHub Actions 自动部署
创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        VITE_STRIPE_PUBLISHABLE_KEY: ${{ secrets.VITE_STRIPE_PUBLISHABLE_KEY }}
        
    - name: Deploy to Cloudflare Pages
      uses: cloudflare/pages-action@v1
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        projectName: bidform-app
        directory: dist
```

### 设置 GitHub Secrets
在 GitHub 仓库设置中添加以下 Secrets:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

---

## 🛠️ 一键部署脚本

### Windows 批处理脚本 (deploy.bat)
```batch
@echo off
echo 🚀 BidForm Cloudflare 部署脚本
echo ===============================

echo 📦 检查依赖...
where wrangler >nul 2>nul
if %errorlevel% neq 0 (
    echo 安装 Wrangler CLI...
    npm install -g wrangler
)

echo 🔐 登录 Cloudflare...
wrangler login

echo 🏗️ 构建项目...
npm run build

echo 🚀 部署到 Cloudflare Pages...
wrangler pages deploy dist --project-name=bidform-app

echo ✅ 部署完成！
echo 🌐 访问: https://bidform-app.pages.dev
pause
```

### Linux/Mac 脚本 (deploy.sh)
```bash
#!/bin/bash
echo "🚀 BidForm Cloudflare 部署脚本"
echo "==============================="

# 检查并安装 Wrangler CLI
if ! command -v wrangler &> /dev/null; then
    echo "📦 安装 Wrangler CLI..."
    npm install -g wrangler
fi

echo "🔐 登录 Cloudflare..."
wrangler login

echo "🏗️ 构建项目..."
npm run build

echo "🚀 部署到 Cloudflare Pages..."
wrangler pages deploy dist --project-name=bidform-app

echo "✅ 部署完成！"
echo "🌐 访问: https://bidform-app.pages.dev"
```

---

## 📊 部署后验证清单

### ✅ 功能测试
- [ ] 网站可以正常访问
- [ ] 页面样式正确显示
- [ ] 路由导航正常工作
- [ ] 测试页面 `/test` 可访问
- [ ] BidWidget 组件正常显示
- [ ] 表单提交功能正常

### ✅ 性能检查
- [ ] Lighthouse 性能评分 > 90
- [ ] 首屏加载时间 < 3秒
- [ ] 图片和资源正确加载
- [ ] 移动端响应式正常

### ✅ 安全验证
- [ ] HTTPS 证书自动配置
- [ ] 安全头部正确设置
- [ ] 环境变量不泄露
- [ ] API 密钥安全存储

---

## 🔍 故障排除

### 常见问题及解决方案

**1. 构建失败**
```bash
# 检查 Node.js 版本
node --version  # 应该 >= 16

# 清理缓存重新安装
rm -rf node_modules package-lock.json
npm install
npm run build
```

**2. 环境变量不生效**
- 确保变量名以 `VITE_` 开头
- 检查 Cloudflare Pages 设置中的环境变量
- 重新部署项目

**3. 路由 404 错误**
- 确保 `_redirects` 文件存在
- 检查 SPA 重定向规则

**4. API 连接失败**
- 验证 Supabase URL 和密钥
- 检查 CORS 设置
- 确认网络连接

---

## 📞 获取帮助

### 官方文档
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Supabase 文档](https://supabase.com/docs)

### 社区支持
- [Cloudflare Discord](https://discord.gg/cloudflaredev)
- [GitHub Issues](https://github.com/manulinco/Bidform/issues)

---

## 🎉 部署成功！

恭喜！你的 BidForm 应用现在已经部署到 Cloudflare Pages。

**访问链接:**
- 主站: https://bidform-app.pages.dev
- 测试页面: https://bidform-app.pages.dev/test

**下一步:**
1. 配置自定义域名
2. 设置监控和分析
3. 优化性能和SEO
4. 添加更多功能

享受你的在线投标表单应用吧！🚀