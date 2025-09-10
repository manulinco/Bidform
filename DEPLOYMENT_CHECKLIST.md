# 🚀 BidForm Cloudflare Pages 部署完整清单

## 📋 必需环境变量清单

### ✅ 核心必需变量 (4个)

| 变量名 | 用途 | 获取方式 | 示例值 |
|--------|------|----------|--------|
| `VITE_SUPABASE_URL` | Supabase 项目地址 | Supabase Dashboard → Settings → API | `https://abcdefgh.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase 公开密钥 | Supabase Dashboard → Settings → API | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe 公开密钥 | Stripe Dashboard → Developers → API keys | `pk_test_51...` 或 `pk_live_51...` |
| `NODE_ENV` | 环境类型 | 手动设置 | `production` |

### 🔧 获取环境变量详细步骤

#### 1. 获取 Supabase 配置
```bash
步骤 1: 访问 https://supabase.com
步骤 2: 登录账户
步骤 3: 选择项目 (如果没有项目，点击 "New project" 创建)
步骤 4: 点击左侧菜单 "Settings" → "API"
步骤 5: 复制以下信息:
   - Project URL → VITE_SUPABASE_URL
   - anon public → VITE_SUPABASE_ANON_KEY
```

#### 2. 获取 Stripe 配置
```bash
步骤 1: 访问 https://dashboard.stripe.com
步骤 2: 登录账户
步骤 3: 点击左侧菜单 "Developers" → "API keys"
步骤 4: 复制 "Publishable key" → VITE_STRIPE_PUBLISHABLE_KEY
注意: 测试环境用 pk_test_，生产环境用 pk_live_
```

---

## 🎯 完整部署步骤 (三种方式)

### 方式 1: 一键脚本部署 (推荐)

#### Windows 用户
```bash
步骤 1: 打开项目文件夹 D:\Dtools\Bidform
步骤 2: 双击运行 deploy.bat 文件
步骤 3: 按照提示操作:
   - 自动安装 Wrangler CLI
   - 浏览器打开登录 Cloudflare
   - 自动构建和部署项目
步骤 4: 部署成功后记录访问地址
```

#### Linux/Mac 用户
```bash
步骤 1: 打开终端，进入项目目录
cd /path/to/Bidform

步骤 2: 给脚本执行权限
chmod +x deploy.sh

步骤 3: 运行部署脚本
./deploy.sh

步骤 4: 按照提示操作 (同 Windows)
```

### 方式 2: Cloudflare Dashboard 手动部署

#### 步骤 1: 登录 Cloudflare
```bash
1. 访问 https://dash.cloudflare.com
2. 登录账户 (没有账户请先注册)
3. 进入 Dashboard 主页
```

#### 步骤 2: 创建 Pages 项目
```bash
1. 点击左侧菜单 "Pages"
2. 点击 "Create a project" 按钮
3. 选择 "Connect to Git"
4. 点击 "Connect GitHub" 并授权
5. 在仓库列表中选择 "manulinco/Bidform"
6. 点击 "Begin setup"
```

#### 步骤 3: 配置构建设置
```yaml
项目名称: bidform-app
生产分支: main
框架预设: Vite
构建命令: npm run build
构建输出目录: dist
根目录: / (保持默认)
Node.js 版本: 18 (在高级设置中)
```

#### 步骤 4: 添加环境变量
```bash
在 "Environment variables" 部分点击 "Add variable"
逐个添加以下 4 个变量:

变量 1:
- Variable name: VITE_SUPABASE_URL
- Value: https://your-project.supabase.co

变量 2:
- Variable name: VITE_SUPABASE_ANON_KEY
- Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

变量 3:
- Variable name: VITE_STRIPE_PUBLISHABLE_KEY
- Value: pk_test_51... (或 pk_live_51...)

变量 4:
- Variable name: NODE_ENV
- Value: production
```

#### 步骤 5: 开始部署
```bash
1. 点击 "Save and Deploy"
2. 等待构建完成 (2-5 分钟)
3. 构建成功后会显示访问链接
```

### 方式 3: 命令行手动部署

#### 步骤 1: 安装 Wrangler CLI
```bash
npm install -g wrangler
```

#### 步骤 2: 登录 Cloudflare
```bash
wrangler login
# 浏览器会打开，登录你的 Cloudflare 账户
```

#### 步骤 3: 创建 Pages 项目
```bash
wrangler pages project create bidform-app
```

#### 步骤 4: 构建项目
```bash
npm run build
```

#### 步骤 5: 部署项目
```bash
wrangler pages deploy dist --project-name=bidform-app
```

#### 步骤 6: 设置环境变量
```bash
wrangler pages secret put VITE_SUPABASE_URL --project-name=bidform-app
# 输入: https://your-project.supabase.co

wrangler pages secret put VITE_SUPABASE_ANON_KEY --project-name=bidform-app
# 输入: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

wrangler pages secret put VITE_STRIPE_PUBLISHABLE_KEY --project-name=bidform-app
# 输入: pk_test_51... 或 pk_live_51...

wrangler pages secret put NODE_ENV --project-name=bidform-app
# 输入: production
```

---

## 🔍 部署后验证清单

### ✅ 基础功能检查
- [ ] 网站可以正常访问: https://bidform-app.pages.dev
- [ ] 页面样式正确显示 (无样式错误)
- [ ] 主页面加载正常
- [ ] 测试页面可访问: https://bidform-app.pages.dev/test
- [ ] 路由导航正常工作 (点击链接不报错)

### ✅ 组件功能检查
- [ ] BidWidget 组件正常显示
- [ ] "Make an Offer" 按钮可点击
- [ ] 表单弹窗正常打开
- [ ] 输入框可以正常输入
- [ ] 没有 JavaScript 错误 (F12 控制台检查)

### ✅ 环境变量检查
- [ ] Supabase 连接正常 (无连接错误)
- [ ] Stripe 组件加载正常
- [ ] 控制台无环境变量相关错误
- [ ] 网络请求正常 (F12 Network 标签检查)

---

## 🚨 常见问题排查

### 问题 1: 构建失败
```bash
症状: npm run build 报错
解决方案:
1. 检查 Node.js 版本: node --version (需要 >= 16)
2. 清理缓存: rm -rf node_modules package-lock.json
3. 重新安装: npm install
4. 再次构建: npm run build
```

### 问题 2: 部署失败
```bash
症状: wrangler deploy 报错
解决方案:
1. 检查登录状态: wrangler whoami
2. 重新登录: wrangler login
3. 检查项目名称是否正确
4. 确认 dist 目录存在
```

### 问题 3: 环境变量不生效
```bash
症状: 网站显示但功能异常
解决方案:
1. 确认变量名以 VITE_ 开头
2. 检查 Cloudflare Pages 设置中的环境变量
3. 重新部署项目 (环境变量更改后需要重新部署)
4. 检查浏览器控制台错误信息
```

### 问题 4: 页面 404 错误
```bash
症状: 刷新页面或直接访问路由报 404
解决方案:
1. 确认 _redirects 文件存在
2. 检查文件内容: /*    /index.html   200
3. 重新部署项目
```

---

## 📞 获取帮助

### 🔗 有用链接
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Supabase 文档](https://supabase.com/docs)
- [Stripe 文档](https://stripe.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)

### 💬 社区支持
- [Cloudflare Discord](https://discord.gg/cloudflaredev)
- [GitHub Issues](https://github.com/manulinco/Bidform/issues)

---

## 🎉 部署成功确认

当你看到以下内容时，说明部署成功：

```bash
✅ 部署完成！
🌐 访问地址: https://bidform-app.pages.dev
🧪 测试页面: https://bidform-app.pages.dev/test
```

### 最终检查清单
- [ ] 主页面正常显示
- [ ] 测试页面可以访问
- [ ] BidWidget 功能正常
- [ ] 无 JavaScript 错误
- [ ] 移动端显示正常
- [ ] 所有链接可点击

**恭喜！你的 BidForm 应用现在已经在线运行！** 🚀