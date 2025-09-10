# 🚀 BidForm 部署完整清单 - 可直接复制粘贴

## 📋 环境变量清单 (可直接复制)

### 方式 1: 逐个复制 (推荐)

**变量 1:**
```
VITE_SUPABASE_URL
```
```
https://dxsjhbigwotzscnsdiek.supabase.co
```

**变量 2:**
```
VITE_SUPABASE_ANON_KEY
```
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4c2poYmlnd290enNjbnNkaWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjg2NDIsImV4cCI6MjA3MTcwNDY0Mn0.WgIxJsVQfZkC_u17T_ol9dyJf5oq203rAO6gTRmGWFY
```

**变量 3:**
```
VITE_STRIPE_PUBLISHABLE_KEY
```
```
pk_live_51RukL5QcIvw8mQk3EM4UzjmVEbKj9Dy7fOf5DI6421Gg1XRQNPx4SRZsZEBP3cZpzuF55jCEjEv1DPssCR9mZohk00j0A5wqwc
```

**变量 4:**
```
NODE_ENV
```
```
production
```

**变量 5 (可选):**
```
VITE_GOOGLE_CLIENT_ID
```
```
378956299242-5sahap5fl9n9f57r694f87g3e0hbrsc4.apps.googleusercontent.com
```

**变量 6 (可选):**
```
VITE_SITE_ID
```
```
bidform
```

---

## 🎯 详细部署步骤

### 步骤 1: 登录 Cloudflare Dashboard
1. 打开浏览器，访问: https://dash.cloudflare.com
2. 登录你的 Cloudflare 账户
3. 如果没有账户，点击 "Sign Up" 免费注册

### 步骤 2: 创建 Pages 项目
1. 在左侧菜单中点击 **"Pages"**
2. 点击 **"Create a project"** 按钮
3. 选择 **"Connect to Git"**
4. 点击 **"Connect GitHub"** 并授权访问
5. 在仓库列表中找到并选择 **"manulinco/Bidform"**
6. 点击 **"Begin setup"**

### 步骤 3: 配置项目设置
在项目配置页面填入以下信息:

**项目名称:**
```
bidform-app
```

**生产分支:**
```
main
```

**框架预设:**
```
Vite
```

**构建命令:**
```
npm run build
```

**构建输出目录:**
```
dist
```

**根目录:**
```
/
```

### 步骤 4: 添加环境变量
在 "Environment variables" 部分，点击 **"Add variable"** 按钮，逐个添加以下变量:

#### 必需变量 (必须添加)

**第 1 个变量:**
- Variable name: `VITE_SUPABASE_URL`
- Value: `https://dxsjhbigwotzscnsdiek.supabase.co`

**第 2 个变量:**
- Variable name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4c2poYmlnd290enNjbnNkaWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjg2NDIsImV4cCI6MjA3MTcwNDY0Mn0.WgIxJsVQfZkC_u17T_ol9dyJf5oq203rAO6gTRmGWFY`

**第 3 个变量:**
- Variable name: `VITE_STRIPE_PUBLISHABLE_KEY`
- Value: `pk_live_51RukL5QcIvw8mQk3EM4UzjmVEbKj9Dy7fOf5DI6421Gg1XRQNPx4SRZsZEBP3cZpzuF55jCEjEv1DPssCR9mZohk00j0A5wqwc`

**第 4 个变量:**
- Variable name: `NODE_ENV`
- Value: `production`

#### 可选变量 (建议添加)

**第 5 个变量:**
- Variable name: `VITE_GOOGLE_CLIENT_ID`
- Value: `378956299242-5sahap5fl9n9f57r694f87g3e0hbrsc4.apps.googleusercontent.com`

**第 6 个变量:**
- Variable name: `VITE_SITE_ID`
- Value: `bidform`

### 步骤 5: 开始部署
1. 确认所有设置正确
2. 点击 **"Save and Deploy"** 按钮
3. 等待构建完成 (通常需要 2-5 分钟)
4. 构建成功后会显示访问链接

---

## 📱 操作截图指南

### 添加环境变量的具体操作:
1. **找到环境变量部分**: 在项目配置页面向下滚动，找到 "Environment variables" 部分
2. **点击添加按钮**: 点击 "Add variable" 按钮
3. **输入变量名**: 在 "Variable name" 输入框中输入变量名 (如: `VITE_SUPABASE_URL`)
4. **输入变量值**: 在 "Value" 输入框中粘贴对应的值
5. **保存变量**: 点击 "Add" 或 "Save" 按钮
6. **重复操作**: 对每个变量重复上述步骤

---

## ✅ 部署完成后验证

### 访问地址:
- **主站**: https://bidform-app.pages.dev
- **测试页面**: https://bidform-app.pages.dev/test

### 检查清单:
- [ ] 网站可以正常打开
- [ ] 页面样式显示正确
- [ ] BidWidget 组件正常显示
- [ ] "Make an Offer" 按钮可以点击
- [ ] 表单弹窗可以正常打开
- [ ] 浏览器控制台无错误 (按 F12 检查)

---

## 🚨 常见问题

### 问题 1: 找不到仓库
**解决方案**: 确保已经授权 Cloudflare 访问你的 GitHub 账户，并且仓库名称是 `manulinco/Bidform`

### 问题 2: 构建失败
**解决方案**: 检查环境变量是否正确添加，特别是变量名必须完全匹配 (区分大小写)

### 问题 3: 网站打开但功能异常
**解决方案**: 
1. 检查所有 4 个必需环境变量是否都已添加
2. 确认变量值没有多余的空格
3. 重新部署项目

### 问题 4: 环境变量不生效
**解决方案**: 添加或修改环境变量后，必须重新部署项目才能生效

---

## 🔄 重新部署方法

如果需要重新部署:
1. 进入 Cloudflare Pages 项目页面
2. 点击 "Deployments" 标签
3. 点击 "Retry deployment" 或推送新代码到 GitHub

---

## 📞 需要帮助?

如果遇到问题:
1. 检查上述步骤是否完全按照执行
2. 确认所有环境变量都已正确添加
3. 查看 Cloudflare Pages 的构建日志
4. 检查浏览器控制台的错误信息

**记住**: 每个步骤都很重要，不要跳过任何一步！