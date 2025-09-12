# BidForm 系统架构文档

## 概述

BidForm 是一个可嵌入的出价+定金支付系统，允许商家在自己的网站上集成买家出价功能。系统采用前后端分离架构，支持演示模式和生产模式。

## 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **状态管理**: Zustand
- **路由**: React Router v6
- **UI组件**: 自定义组件 + Tailwind CSS
- **图标**: Lucide React
- **通知**: React Hot Toast
- **表单**: React Hook Form + Zod (计划中)

### 后端服务
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **支付**: Stripe Connect
- **文件存储**: Supabase Storage

### 部署
- **前端**: Vercel/Netlify
- **CDN**: 用于 widget.js 分发
- **域名**: bidform.online

## 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   商家网站       │    │   BidForm       │    │   第三方服务     │
│                │    │   平台          │    │                │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │ Widget.js │◄─┼────┼─►│  前端应用  │  │    │  │ Supabase  │  │
│  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │
│                │    │  ┌───────────┐  │    │  ┌───────────┐  │
│                │    │  │ Dashboard │  │    │  │  Stripe   │  │
│                │    │  └───────────┘  │    │  └───────────┘  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 核心模块

### 1. BidWidget 组件
**位置**: `src/components/BidWidget/BidWidget.tsx`

**功能**:
- 可嵌入的出价表单
- 支持主题定制
- 实时价格验证
- 定金计算
- 支付流程集成

**Props**:
```typescript
interface BidWidgetProps {
  formId?: string
  title: string
  price: number
  currency: string
  themeColor?: string
  minBidRatio?: number
  depositPercentage?: number
  allowOptionalMessage?: boolean
}
```

### 2. 状态管理

#### DemoStore (`src/stores/demoStore.ts`)
- 演示模式数据管理
- 模拟产品和出价
- 本地状态持久化

#### AuthStore (`src/stores/authStore.ts`)
- 用户认证状态
- 登录/登出逻辑
- 会话管理

### 3. API 层

#### 支付服务 (`src/lib/stripe.ts`)
```typescript
// 创建支付意图
export async function createPaymentIntent(amount: number, currency: string)

// 计算定金金额
export function calculatePrepaymentAmount(offerAmount: number, percentage: number)
```

#### 数据服务 (`src/lib/supabase.ts`)
```typescript
// Supabase 客户端配置
export const supabase = createClient(url, key)
```

## 数据流

### 买家出价流程

```
1. 买家填写表单
   ↓
2. 前端验证 (最低出价、必填字段)
   ↓
3. 创建 Offer 记录 (status: pending)
   ↓
4. 创建 Stripe PaymentIntent (定金)
   ↓
5. 买家完成支付
   ↓
6. Webhook 更新 Offer (deposit_status: paid)
   ↓
7. 通知商家有新出价
```

### 商家处理流程

```
1. 商家登录 Dashboard
   ↓
2. 查看已付定金的出价列表
   ↓
3. 选择接受/拒绝
   ↓
4a. 接受: 创建尾款 PaymentIntent
    ↓
    通知买家支付尾款
   ↓
4b. 拒绝: 退还定金
    ↓
    关闭出价
```

## 演示模式 vs 生产模式

### 演示模式 (VITE_DEMO_MODE=true)
- 不调用真实 API
- 使用本地 Zustand store
- 模拟支付成功
- 无需配置 Supabase/Stripe

### 生产模式 (VITE_DEMO_MODE=false)
- 连接 Supabase 数据库
- 集成 Stripe 支付
- 真实的认证和授权
- Webhook 处理

## 安全考虑

### 前端安全
- 环境变量验证
- XSS 防护 (React 内置)
- CSRF 保护
- 输入验证和清理

### 后端安全
- RLS (Row Level Security) 策略
- API 密钥管理
- Webhook 签名验证
- 支付金额服务端验证

### 数据安全
- 敏感数据加密
- 最小权限原则
- 审计日志
- 定期备份

## 性能优化

### 前端优化
- 代码分割 (React.lazy)
- 图片懒加载
- 缓存策略
- Bundle 分析

### 后端优化
- 数据库索引
- 查询优化
- 连接池
- CDN 加速

## 监控和日志

### 错误监控
- Sentry 集成
- 错误边界
- 用户反馈收集

### 性能监控
- Web Vitals
- API 响应时间
- 数据库查询性能

### 业务监控
- 转化率跟踪
- 支付成功率
- 用户行为分析

## 部署架构

### 环境配置
```
开发环境 (localhost:5173)
├── VITE_DEMO_MODE=true
├── 本地数据存储
└── 模拟支付

测试环境 (staging.bidform.online)
├── VITE_DEMO_MODE=false
├── Supabase 测试项目
└── Stripe 测试模式

生产环境 (bidform.online)
├── VITE_DEMO_MODE=false
├── Supabase 生产项目
└── Stripe 生产模式
```

### CI/CD 流程
```
代码提交
  ↓
GitHub Actions
  ↓
自动化测试
  ↓
构建和部署
  ↓
健康检查
```

## 扩展性设计

### 多租户支持
- 商家隔离
- 数据分区
- 自定义域名

### 国际化
- 多语言支持
- 多币种结算
- 本地化支付方式

### API 扩展
- GraphQL 支持
- Webhook 系统
- 第三方集成

## 故障恢复

### 数据备份
- 自动备份策略
- 跨区域复制
- 恢复测试

### 灾难恢复
- 故障转移
- 服务降级
- 紧急响应

## 开发指南

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm test

# 构建生产版本
npm run build
```

### 代码规范
- TypeScript 严格模式
- ESLint + Prettier
- 提交信息规范
- 代码审查流程

### 测试策略
- 单元测试 (Jest + Testing Library)
- 集成测试
- E2E 测试 (Playwright)
- 性能测试