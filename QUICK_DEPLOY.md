# ⚡ BidForm 快速部署指南

## 🚀 一键部署 (推荐)

### Windows 用户
```bash
# 双击运行或在命令行执行
deploy.bat
```

### Linux/Mac 用户
```bash
# 给脚本执行权限
chmod +x deploy.sh

# 运行部署脚本
./deploy.sh
```

---

## 📋 手动部署步骤

### 1. 安装 Wrangler CLI
```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare
```bash
wrangler login
```

### 3. 构建项目
```bash
npm run build
```

### 4. 部署到 Cloudflare Pages
```bash
wrangler pages deploy dist --project-name=bidform-app
```

---

## 🔧 环境变量配置

部署成功后，需要在 Cloudflare Pages 设置中添加以下环境变量：

### 必需的环境变量
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51... (生产) 或 pk_test_51... (测试)
NODE_ENV=production
```

### 获取环境变量值

**Supabase:**
1. 登录 https://supabase.com
2. 选择项目 → Settings → API
3. 复制 Project URL 和 anon public key

**Stripe:**
1. 登录 https://dashboard.stripe.com
2. Developers → API keys
3. 复制 Publishable key

---

## 🌐 访问你的应用

部署成功后，你的应用将在以下地址可用：

- **主站**: https://bidform-app.pages.dev
- **测试页面**: https://bidform-app.pages.dev/test

---

## 🔄 自动部署设置

### GitHub Actions 自动部署
1. 在 GitHub 仓库设置中添加以下 Secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

2. 每次推送到 main 分支将自动触发部署

### 获取 Cloudflare API Token
1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. 点击 "Create Token"
3. 使用 "Custom token" 模板
4. 权限设置:
   - Account: Cloudflare Pages:Edit
   - Zone: Zone:Read
   - Account: Account:Read

---

## ✅ 部署验证清单

- [ ] 网站可以正常访问
- [ ] 页面样式正确显示
- [ ] 路由导航正常工作
- [ ] 测试页面可访问
- [ ] BidWidget 组件正常显示
- [ ] 环境变量配置正确

---

## 🆘 遇到问题？

1. **构建失败**: 检查 Node.js 版本 (需要 >= 16)
2. **部署失败**: 确认 Cloudflare 登录状态
3. **环境变量问题**: 检查变量名是否以 `VITE_` 开头
4. **功能异常**: 验证 Supabase 和 Stripe 配置

详细故障排除请查看 `DEPLOY_GUIDE.md`

---

## 🎉 部署成功！

恭喜！你的 BidForm 应用现在已经在线运行。

**下一步:**
1. 配置自定义域名
2. 设置监控和分析
3. 测试所有功能
4. 分享给用户使用

享受你的在线投标表单应用！🚀