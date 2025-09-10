# 🔧 环境变量配置助手

## 📋 必需变量清单 (共4个)

### ✅ 变量 1: VITE_SUPABASE_URL
**用途**: Supabase 数据库连接地址  
**获取步骤**:
1. 访问 https://supabase.com
2. 登录账户
3. 选择项目 (或创建新项目)
4. 左侧菜单: Settings → API
5. 复制 "Project URL"

**示例值**: `https://abcdefghijklmnop.supabase.co`

---

### ✅ 变量 2: VITE_SUPABASE_ANON_KEY
**用途**: Supabase 公开访问密钥  
**获取步骤**:
1. 在同一个 Supabase API 页面
2. 复制 "anon public" 密钥

**示例值**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc2ODAwMCwiZXhwIjoyMDE0MzQ0MDAwfQ.example_signature`

---

### ✅ 变量 3: VITE_STRIPE_PUBLISHABLE_KEY
**用途**: Stripe 支付处理公开密钥  
**获取步骤**:
1. 访问 https://dashboard.stripe.com
2. 登录账户
3. 左侧菜单: Developers → API keys
4. 复制 "Publishable key"

**测试环境**: `pk_test_51ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890`  
**生产环境**: `pk_live_51ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890`

---

### ✅ 变量 4: NODE_ENV
**用途**: 环境类型标识  
**设置值**: `production`

---

## 🎯 配置方法

### 方法 1: Cloudflare Pages Dashboard
1. 登录 https://dash.cloudflare.com
2. 进入你的 Pages 项目
3. 点击 "Settings" → "Environment variables"
4. 点击 "Add variable" 逐个添加上述 4 个变量

### 方法 2: Wrangler CLI
```bash
wrangler pages secret put VITE_SUPABASE_URL --project-name=bidform-app
wrangler pages secret put VITE_SUPABASE_ANON_KEY --project-name=bidform-app
wrangler pages secret put VITE_STRIPE_PUBLISHABLE_KEY --project-name=bidform-app
wrangler pages secret put NODE_ENV --project-name=bidform-app
```

---

## 📝 配置检查清单

### ✅ Supabase 配置检查
- [ ] 已创建 Supabase 项目
- [ ] 已获取 Project URL
- [ ] 已获取 anon public key
- [ ] URL 格式正确 (https://xxx.supabase.co)
- [ ] 密钥以 eyJ 开头

### ✅ Stripe 配置检查
- [ ] 已创建 Stripe 账户
- [ ] 已获取 Publishable key
- [ ] 测试环境用 pk_test_ 开头
- [ ] 生产环境用 pk_live_ 开头

### ✅ Cloudflare 配置检查
- [ ] 已在 Cloudflare Pages 中添加所有 4 个变量
- [ ] 变量名拼写正确 (区分大小写)
- [ ] 变量值无多余空格
- [ ] 已重新部署项目 (环境变量更改后必须重新部署)

---

## 🚨 常见错误

### ❌ 错误 1: 变量名不正确
```bash
错误: SUPABASE_URL (缺少 VITE_ 前缀)
正确: VITE_SUPABASE_URL
```

### ❌ 错误 2: Supabase URL 格式错误
```bash
错误: supabase.co/dashboard/project/xxx
正确: https://xxx.supabase.co
```

### ❌ 错误 3: Stripe 密钥类型错误
```bash
错误: sk_test_xxx (这是 Secret key，不是 Publishable key)
正确: pk_test_xxx (Publishable key)
```

### ❌ 错误 4: 忘记重新部署
```bash
问题: 添加环境变量后网站仍然不工作
解决: 必须重新部署项目才能生效
```

---

## 🔍 验证配置

### 部署后检查
1. 访问 https://bidform-app.pages.dev
2. 打开浏览器开发者工具 (F12)
3. 查看 Console 标签，确认无错误信息
4. 查看 Network 标签，确认 API 请求正常

### 功能测试
1. 访问测试页面: https://bidform-app.pages.dev/test
2. 点击 "Make an Offer" 按钮
3. 填写表单并提交
4. 确认无错误提示

---

## 📞 需要帮助？

如果遇到问题，请检查：
1. 所有 4 个环境变量都已正确添加
2. 变量名拼写正确 (区分大小写)
3. 变量值格式正确 (无多余空格)
4. 已重新部署项目
5. 浏览器控制台无错误信息

**记住**: 每次修改环境变量后都必须重新部署项目！