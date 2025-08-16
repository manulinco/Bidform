# 🚀 Cloudflare Pages 自动部署指南

## 📋 自动部署步骤

### 1. 连接GitHub到Cloudflare Pages

1. **登录Cloudflare Dashboard**
   - 访问: https://dash.cloudflare.com
   - 登录你的Cloudflare账户

2. **创建新的Pages项目**
   ```
   1. 点击 "Pages" 在左侧菜单
   2. 点击 "Create a project"
   3. 选择 "Connect to Git"
   4. 授权GitHub访问
   5. 选择仓库: manulinco/Bidform
   ```

### 2. 配置构建设置

```yaml
项目名称: bidform-online
生产分支: main
构建命令: npm run build
构建输出目录: dist
根目录: /
Node.js版本: 18
```

### 3. 环境变量配置

在Cloudflare Pages设置中添加以下环境变量：

```bash
# Supabase配置
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe配置
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key

# 生产环境配置
NODE_ENV=production
VITE_APP_URL=https://bidform.online
```

### 4. 自定义域名设置

1. **添加自定义域名**
   ```
   1. 在Pages项目中点击 "Custom domains"
   2. 点击 "Set up a custom domain"
   3. 输入: bidform.online
   4. 添加DNS记录（自动配置）
   ```

2. **DNS配置**
   ```
   类型: CNAME
   名称: @
   目标: bidform-online.pages.dev
   
   类型: CNAME  
   名称: www
   目标: bidform-online.pages.dev
   ```

## 🔄 自动部署工作流

### GitHub Actions配置

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ main ]
  pull_request:
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
        projectName: bidform-online
        directory: dist
        gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

## 🛠️ 一键部署脚本

### Windows批处理脚本
```batch
@echo off
echo 🚀 BidForm.online Cloudflare自动部署
echo =====================================

echo 📦 安装Wrangler CLI...
npm install -g wrangler

echo 🔐 登录Cloudflare...
wrangler login

echo 📋 创建Pages项目...
wrangler pages project create bidform-online

echo 🔧 设置环境变量...
wrangler pages secret put VITE_SUPABASE_URL --project-name=bidform-online
wrangler pages secret put VITE_SUPABASE_ANON_KEY --project-name=bidform-online
wrangler pages secret put VITE_STRIPE_PUBLISHABLE_KEY --project-name=bidform-online

echo 🏗️ 构建项目...
npm run build

echo 🚀 部署到Cloudflare Pages...
wrangler pages deploy dist --project-name=bidform-online

echo ✅ 部署完成！
echo 🌐 访问: https://bidform-online.pages.dev
pause
```

### Linux/Mac脚本
```bash
#!/bin/bash
echo "🚀 BidForm.online Cloudflare自动部署"
echo "====================================="

# 安装Wrangler CLI
echo "📦 安装Wrangler CLI..."
npm install -g wrangler

# 登录Cloudflare
echo "🔐 登录Cloudflare..."
wrangler login

# 创建Pages项目
echo "📋 创建Pages项目..."
wrangler pages project create bidform-online

# 构建项目
echo "🏗️ 构建项目..."
npm run build

# 部署
echo "🚀 部署到Cloudflare Pages..."
wrangler pages deploy dist --project-name=bidform-online

echo "✅ 部署完成！"
echo "🌐 访问: https://bidform-online.pages.dev"
```

## 📊 部署监控

### 部署状态检查
```bash
# 检查部署状态
wrangler pages deployment list --project-name=bidform-online

# 查看部署日志
wrangler pages deployment tail --project-name=bidform-online
```

### 性能优化
```javascript
// vite.config.ts 优化配置
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'react-hot-toast'],
          auth: ['@supabase/supabase-js'],
          payment: ['@stripe/stripe-js']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

## 🔒 安全配置

### Headers配置 (_headers文件)
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://api.stripe.com;

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

## 🎯 完成后验证

1. ✅ 访问 https://bidform-online.pages.dev
2. ✅ 检查自定义域名 https://bidform.online
3. ✅ 测试所有功能正常工作
4. ✅ 验证SSL证书已自动配置
5. ✅ 检查性能评分 (Lighthouse)

## 📞 故障排除

### 常见问题
1. **构建失败**: 检查环境变量配置
2. **域名不工作**: 验证DNS设置
3. **API错误**: 确认Supabase/Stripe配置
4. **性能问题**: 启用缓存和压缩

---

**🎉 自动部署配置完成！每次推送到main分支都会自动部署到Cloudflare Pages**