# ☁️ Cloudflare Pages 部署指南

## 🎯 部署到 Cloudflare Pages

### 方法1: 通过 Cloudflare Dashboard (推荐)

#### 步骤1: 准备工作
1. 访问 https://pages.cloudflare.com
2. 注册/登录 Cloudflare 账户
3. 确保你的 GitHub 仓库 `manulinco/Bidform` 可访问

#### 步骤2: 创建项目
1. 点击 **"Create a project"**
2. 选择 **"Connect to Git"**
3. 授权 Cloudflare 访问 GitHub
4. 选择仓库 `manulinco/Bidform`

#### 步骤3: 配置构建设置
```
Project name: bidform
Production branch: main
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: / (留空)
```

#### 步骤4: 环境变量设置
在 **Settings > Environment variables** 中添加：
```
VITE_SUPABASE_URL = your_supabase_project_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY = pk_test_...
```

#### 步骤5: 部署
1. 点击 **"Save and Deploy"**
2. 等待构建完成（通常2-5分钟）
3. 获得 `*.pages.dev` 域名

### 方法2: 使用 Wrangler CLI

#### 安装 Wrangler
```bash
npm install -g wrangler
```

#### 登录 Cloudflare
```bash
wrangler login
```

#### 构建项目
```bash
npm run build
```

#### 部署
```bash
wrangler pages deploy dist --project-name=bidform
```

## 🔧 高级配置

### 自定义域名设置
1. 在 Cloudflare Pages 项目中点击 **"Custom domains"**
2. 添加域名 `bidform.online`
3. 按照指示更新 DNS 记录

### DNS 配置示例
```
Type: CNAME
Name: @
Target: bidform.pages.dev
Proxy: ✅ Proxied

Type: CNAME  
Name: www
Target: bidform.pages.dev
Proxy: ✅ Proxied
```

### 环境变量管理
```bash
# 生产环境
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# 预览环境 (可选)
VITE_SUPABASE_URL=https://your-staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 🚀 部署后优化

### 1. 性能优化
- ✅ 自动 CDN 加速
- ✅ 自动图片优化
- ✅ Brotli 压缩
- ✅ HTTP/3 支持

### 2. 安全设置
```
# 在 _headers 文件中已配置
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff  
- X-XSS-Protection: 1; mode=block
- HTTPS 强制重定向
```

### 3. 缓存策略
```
# 静态资源缓存 1 年
/assets/* - Cache-Control: public, max-age=31536000

# HTML 文件不缓存
/*.html - Cache-Control: public, max-age=0
```

## 📊 监控和分析

### Cloudflare Analytics
1. 访问 Cloudflare Dashboard
2. 查看 **Analytics & Logs**
3. 监控访问量、性能指标

### Web Vitals
- 自动监控 Core Web Vitals
- 性能报告和建议
- 实时用户监控 (RUM)

## 🔄 CI/CD 自动部署

### GitHub Actions 集成
Cloudflare Pages 自动监听 GitHub 推送：
- `main` 分支 → 生产环境
- 其他分支 → 预览环境
- Pull Request → 预览部署

### 手动重新部署
```bash
# 重新部署最新版本
wrangler pages deploy dist --project-name=bidform

# 部署特定分支
git checkout feature-branch
npm run build
wrangler pages deploy dist --project-name=bidform
```

## 🌍 全球 CDN 节点

Cloudflare 在全球 200+ 城市有节点：
- 🇺🇸 美国: 洛杉矶、纽约、芝加哥
- 🇪🇺 欧洲: 伦敦、法兰克福、阿姆斯特丹
- 🇦🇸 亚洲: 东京、新加坡、香港
- 🇨🇳 中国: 北京、上海、深圳 (企业版)

## 💰 费用说明

### Cloudflare Pages 免费版
- ✅ 无限静态请求
- ✅ 无限带宽
- ✅ 500 次构建/月
- ✅ 1 个并发构建
- ✅ 自定义域名

### Pro 版 ($20/月)
- ✅ 5000 次构建/月
- ✅ 5 个并发构建
- ✅ 高级分析
- ✅ 优先支持

## 🆘 故障排除

### 常见问题

#### 构建失败
```bash
# 检查 Node.js 版本
echo "NODE_VERSION=18" >> .env

# 检查构建命令
npm run build
```

#### 环境变量不生效
1. 确保变量名以 `VITE_` 开头
2. 重新部署项目
3. 检查变量值是否正确

#### 404 错误
1. 确保 `_redirects` 文件存在
2. 检查 SPA 路由配置
3. 验证构建输出目录

### 获取帮助
- 📖 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- 💬 [Cloudflare 社区](https://community.cloudflare.com/)
- 🎫 [支持工单](https://dash.cloudflare.com/support)

## ✅ 部署检查清单

- [ ] GitHub 仓库已推送最新代码
- [ ] Cloudflare 账户已创建
- [ ] 项目构建设置正确
- [ ] 环境变量已配置
- [ ] 自定义域名已设置 (可选)
- [ ] SSL 证书已激活
- [ ] DNS 记录已更新
- [ ] 网站可正常访问

---

**🎉 恭喜！你的 BidForm.online 现在运行在 Cloudflare 的全球网络上！**