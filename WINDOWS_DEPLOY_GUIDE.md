# 🚀 Windows 用户 Cloudflare Pages 部署指南

## 📋 准备工作

你已经有了完整的密钥配置，现在可以直接部署！

---

## 🎯 方式 1: 一键部署 + 自动配置 (推荐)

### 步骤 1: 一键部署
```bash
# 双击运行部署脚本
deploy.bat
```

### 步骤 2: 自动配置环境变量
```bash
# 双击运行环境变量配置脚本
setup_env_vars.bat
```

### 步骤 3: 访问网站
```bash
# 部署完成后访问
https://bidform-app.pages.dev
```

---

## 🎯 方式 2: Cloudflare Dashboard 手动配置

### 步骤 1: 登录 Cloudflare Dashboard
1. 访问 https://dash.cloudflare.com
2. 登录你的账户

### 步骤 2: 创建 Pages 项目
1. 点击左侧菜单 **"Pages"**
2. 点击 **"Create a project"**
3. 选择 **"Connect to Git"**
4. 连接 GitHub 并选择 **"manulinco/Bidform"** 仓库
5. 点击 **"Begin setup"**

### 步骤 3: 配置构建设置
```yaml
项目名称: bidform-app
生产分支: main
框架预设: Vite
构建命令: npm run build
构建输出目录: dist
```

### 步骤 4: 添加环境变量
在 "Environment variables" 部分，逐个添加以下变量：

#### ✅ 必需变量 (4个)
```bash
变量名: VITE_SUPABASE_URL
值: https://dxsjhbigwotzscnsdiek.supabase.co

变量名: VITE_SUPABASE_ANON_KEY
值: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4c2poYmlnd290enNjbnNkaWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjg2NDIsImV4cCI6MjA3MTcwNDY0Mn0.WgIxJsVQfZkC_u17T_ol9dyJf5oq203rAO6gTRmGWFY

变量名: VITE_STRIPE_PUBLISHABLE_KEY
值: pk_live_51RukL5QcIvw8mQk3EM4UzjmVEbKj9Dy7fOf5DI6421Gg1XRQNPx4SRZsZEBP3cZpzuF55jCEjEv1DPssCR9mZohk00j0A5wqwc

变量名: NODE_ENV
值: production
```

#### 🔧 可选变量 (2个)
```bash
变量名: VITE_GOOGLE_CLIENT_ID
值: 378956299242-5sahap5fl9n9f57r694f87g3e0hbrsc4.apps.googleusercontent.com

变量名: VITE_SITE_ID
值: bidform
```

### 步骤 5: 开始部署
1. 点击 **"Save and Deploy"**
2. 等待构建完成 (2-5 分钟)

---

## 🎯 方式 3: 命令行部署

### 步骤 1: 安装 Wrangler CLI
```bash
npm install -g wrangler
```

### 步骤 2: 登录 Cloudflare
```bash
wrangler login
```

### 步骤 3: 部署项目
```bash
# 构建项目
npm run build

# 创建 Pages 项目
wrangler pages project create bidform-app

# 部署
wrangler pages deploy dist --project-name=bidform-app
```

### 步骤 4: 设置环境变量
```bash
# 运行自动配置脚本
setup_env_vars.bat

# 或者手动设置
wrangler pages secret put VITE_SUPABASE_URL --project-name=bidform-app
# 输入: https://dxsjhbigwotzscnsdiek.supabase.co

wrangler pages secret put VITE_SUPABASE_ANON_KEY --project-name=bidform-app
# 输入: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

wrangler pages secret put VITE_STRIPE_PUBLISHABLE_KEY --project-name=bidform-app
# 输入: pk_live_51RukL5QcIvw8mQk3...

wrangler pages secret put NODE_ENV --project-name=bidform-app
# 输入: production
```

---

## 📁 项目文件说明

### 🔧 配置文件
- **CLOUDFLARE_ENV_VARS.txt** - 可直接复制的环境变量配置
- **setup_env_vars.bat** - 自动配置环境变量的批处理脚本
- **deploy.bat** - 一键部署脚本

### 📖 指南文件
- **DEPLOYMENT_CHECKLIST.md** - 完整部署检查清单
- **ENV_SETUP_GUIDE.md** - 环境变量配置助手
- **QUICK_DEPLOY.md** - 快速部署指南

---

## ✅ 部署后验证

### 1. 访问网站
- **主站**: https://bidform-app.pages.dev
- **测试页面**: https://bidform-app.pages.dev/test

### 2. 功能检查
- [ ] 页面正常加载
- [ ] 样式显示正确
- [ ] BidWidget 组件正常显示
- [ ] "Make an Offer" 按钮可点击
- [ ] 表单弹窗正常打开

### 3. 控制台检查
1. 按 F12 打开开发者工具
2. 查看 Console 标签，确认无错误
3. 查看 Network 标签，确认 API 请求正常

---

## 🚨 常见问题解决

### 问题 1: 构建失败
```bash
解决方案:
1. 确认 Node.js 版本 >= 16
2. 删除 node_modules 重新安装
3. 检查代码是否有语法错误
```

### 问题 2: 环境变量不生效
```bash
解决方案:
1. 确认变量名以 VITE_ 开头
2. 检查变量值无多余空格
3. 重新部署项目 (环境变量更改后必须重新部署)
```

### 问题 3: Stripe 支付异常
```bash
解决方案:
1. 确认使用的是 Publishable Key (pk_live_)
2. 不要使用 Secret Key (sk_live_)
3. 检查 Stripe Dashboard 中的设置
```

### 问题 4: Supabase 连接失败
```bash
解决方案:
1. 确认 URL 格式正确 (https://xxx.supabase.co)
2. 确认 anon key 完整且正确
3. 检查 Supabase 项目是否暂停
```

---

## 🎉 部署成功！

当你看到以下内容时，说明部署成功：

```bash
✅ 网站可以正常访问
✅ BidWidget 功能正常
✅ 支付流程可以启动
✅ 无 JavaScript 错误
```

### 🌐 访问地址
- **生产环境**: https://bidform-app.pages.dev
- **测试页面**: https://bidform-app.pages.dev/test

### 🔄 自动部署
每次推送代码到 GitHub main 分支都会自动触发重新部署。

### 📊 监控和管理
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Stripe Dashboard**: https://dashboard.stripe.com

---

## 🚀 下一步

1. **测试所有功能** - 确保投标流程完整工作
2. **配置自定义域名** - 如果有自己的域名
3. **设置监控** - 配置错误监控和性能监控
4. **优化 SEO** - 添加元标签和结构化数据

恭喜！你的 BidForm 应用现在已经在线运行！🎉