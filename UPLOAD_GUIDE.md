# 📁 BidForm.online 手动上传指南

## 🎯 GitHub 仓库地址
https://github.com/manulinco/bidform

## 📋 必须上传的文件清单

### 根目录文件
```
✅ package.json          - 项目依赖配置
✅ README.md             - 项目说明文档
✅ index.html            - HTML入口文件
✅ vite.config.ts        - Vite构建配置
✅ tailwind.config.js    - Tailwind CSS配置
✅ tsconfig.json         - TypeScript配置
✅ tsconfig.app.json     - TypeScript应用配置
✅ tsconfig.node.json    - TypeScript Node配置
✅ eslint.config.js      - ESLint配置
✅ postcss.config.js     - PostCSS配置
✅ .env.example          - 环境变量示例
✅ .gitignore            - Git忽略文件
✅ DEPLOYMENT.md         - 部署指南
✅ deploy.bat            - Windows部署脚本
✅ deploy.sh             - Linux/Mac部署脚本
```

### src/ 目录结构
```
src/
├── App.tsx              ✅ 主应用组件
├── main.tsx             ✅ React入口文件
├── index.css            ✅ 全局样式文件
├── vite-env.d.ts        ✅ Vite类型定义
├── components/          📁 组件目录
│   ├── Auth/
│   │   └── LoginModal.tsx           ✅ 登录模态框
│   ├── BidWidget/
│   │   └── BidWidget.tsx            ✅ 竞价组件
│   └── Dashboard/
│       ├── Dashboard.tsx            ✅ 仪表板主页
│       ├── BidFormsList.tsx         ✅ 表单列表
│       ├── CreateBidFormModal.tsx   ✅ 创建表单模态框
│       └── OffersList.tsx           ✅ 报价列表
├── stores/              📁 状态管理
│   ├── authStore.ts     ✅ 认证状态
│   └── merchantStore.ts ✅ 商户状态
├── lib/                 📁 工具库
│   ├── supabase.ts      ✅ Supabase配置
│   └── stripe.ts        ✅ Stripe配置
└── api/                 📁 API接口
    └── create-payment-intent.ts ✅ 支付接口
```

## 🚀 上传步骤

### 方法1: GitHub Web界面上传
1. 访问 https://github.com/manulinco/bidform
2. 点击 "Add file" > "Upload files"
3. 拖拽所有文件到上传区域
4. 填写提交信息: "Initial commit: BidForm.online project"
5. 点击 "Commit changes"

### 方法2: GitHub Desktop
1. 下载安装 GitHub Desktop
2. Clone 仓库到本地
3. 复制所有项目文件到仓库目录
4. 在 GitHub Desktop 中提交并推送

### 方法3: 压缩包上传
1. 将所有文件打包成 zip
2. 在 GitHub 仓库页面上传 zip 文件
3. GitHub 会自动解压文件

## ⚠️ 注意事项

### 不要上传的文件/目录：
- `node_modules/` - 依赖包目录（太大，会自动安装）
- `.git/` - Git版本控制目录
- `dist/` 或 `build/` - 构建输出目录
- `.env` - 包含敏感信息的环境变量文件

### 必须保持的目录结构：
```
bidform/
├── src/
│   ├── components/
│   ├── stores/
│   ├── lib/
│   └── api/
├── package.json
├── README.md
└── 其他配置文件...
```

## 🔧 上传后的验证

上传完成后，检查：
1. ✅ 所有文件都在正确位置
2. ✅ package.json 存在且内容正确
3. ✅ src/ 目录结构完整
4. ✅ README.md 显示正常

## 🚀 部署到 Vercel

上传到 GitHub 后：
1. 访问 https://vercel.com
2. 点击 "New Project"
3. 导入 GitHub 仓库 `manulinco/bidform`
4. 配置环境变量（见 .env.example）
5. 点击 "Deploy"

## 📞 需要帮助？

如果上传过程中遇到问题：
1. 检查文件大小（GitHub单文件限制100MB）
2. 确保网络连接稳定
3. 尝试分批上传文件
4. 联系我获取进一步帮助

---

**上传完成后，项目就可以在 GitHub 上正常访问和部署了！** 🎉