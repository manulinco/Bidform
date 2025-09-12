# BidForm 演示指南

## 概述

BidForm 提供完整的演示模式，让你无需配置任何后端服务就能体验完整的买家出价流程。演示模式模拟了真实的支付和数据处理流程。

## 快速开始

### 1. 启用演示模式

确保 `.env` 文件中设置了演示模式：

```bash
# Demo Mode (set to true to enable demo without login/payment)
VITE_DEMO_MODE=true
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问演示页面

打开浏览器访问：`http://localhost:5173/demo`

## 演示流程

### 买家出价流程演示

1. **查看产品信息**
   - 产品：Vintage Rolex Submariner
   - 价格：$8,500
   - 最低出价：$5,950 (70%)
   - 定金比例：10%

2. **填写出价表单**
   - 点击 "🎯 Try Demo: Make an Offer" 按钮
   - 填写姓名和邮箱
   - 输入出价金额（≥ $5,950）
   - 添加可选留言

3. **查看定金计算**
   - 系统自动计算 10% 定金
   - 显示剩余 90% 尾款金额
   - 实时更新计算结果

4. **模拟支付流程**
   - 点击提交按钮
   - 观看模拟支付处理动画
   - 查看支付成功确认页面

5. **查看结果**
   - 出价详情展示
   - 定金支付确认
   - 等待商家回复提示

### 商家管理演示 (计划中)

1. **查看出价列表**
   - 访问 `/dashboard` (演示模式)
   - 查看所有已付定金的出价
   - 筛选和排序功能

2. **处理出价**
   - 接受出价：生成尾款支付链接
   - 拒绝出价：模拟退款流程
   - 查看出价详情和买家信息

## 演示数据

### 预设产品

```typescript
const demoProducts = [
  {
    id: 'demo_product_1',
    title: 'Vintage Rolex Submariner',
    price: 8500,
    currency: 'USD',
    minBidRatio: 70,
    depositPercentage: 10,
    allowOptionalMessage: true
  },
  {
    id: 'demo_product_2', 
    title: 'MacBook Pro M3 Max',
    price: 3200,
    currency: 'USD',
    minBidRatio: 80,
    depositPercentage: 15,
    allowOptionalMessage: true
  },
  {
    id: 'demo_product_3',
    title: 'Vintage Gibson Les Paul',
    price: 4500,
    currency: 'USD',
    minBidRatio: 60,
    depositPercentage: 20,
    allowOptionalMessage: true
  }
]
```

### 模拟出价

```typescript
const demoOffers = [
  {
    id: 'demo_offer_1',
    buyerName: 'John Smith',
    buyerEmail: 'john@example.com',
    offerAmount: 7800,
    message: 'I\'ve been looking for this exact model. Very interested!',
    status: 'pending',
    depositStatus: 'paid',
    finalStatus: 'pending',
    createdAt: '2 hours ago'
  },
  {
    id: 'demo_offer_2',
    buyerName: 'Sarah Johnson',
    buyerEmail: 'sarah@example.com', 
    offerAmount: 8200,
    message: 'Can you provide more photos of the watch face?',
    status: 'pending',
    depositStatus: 'paid',
    finalStatus: 'pending',
    createdAt: '4 hours ago'
  }
]
```

## 演示功能特性

### ✅ 已实现功能

- [x] 产品信息展示
- [x] 出价表单验证
- [x] 定金计算
- [x] 模拟支付流程
- [x] 成功状态展示
- [x] 响应式设计
- [x] 主题色定制
- [x] 错误处理

### 🚧 计划中功能

- [ ] 商家仪表盘演示
- [ ] 出价状态变更演示
- [ ] 尾款支付演示
- [ ] 退款流程演示
- [ ] 通知系统演示
- [ ] 多产品切换
- [ ] 历史记录查看

## 技术实现

### 演示模式检测

```typescript
// 环境变量检测
const isDemo = import.meta.env.VITE_DEMO_MODE === 'true'

// 组件中使用
const { isDemo, addOffer } = useDemoStore()

if (isDemo) {
  // 演示逻辑
  simulatePayment()
} else {
  // 真实逻辑
  processRealPayment()
}
```

### 状态管理

```typescript
// demoStore.ts
export const useDemoStore = create<DemoStore>((set, get) => ({
  isDemo: import.meta.env.VITE_DEMO_MODE === 'true',
  offers: [],
  products: [],
  currentProduct: null,
  
  addOffer: (offerData) => {
    // 添加演示出价
  },
  
  initializeDemo: () => {
    // 初始化演示数据
  }
}))
```

### 模拟延迟

```typescript
// 模拟网络请求延迟
await new Promise(resolve => setTimeout(resolve, 1500))

// 模拟支付处理时间
await new Promise(resolve => setTimeout(resolve, 2000))
```

## 自定义演示

### 修改产品信息

编辑 `src/stores/demoStore.ts` 中的 `demoProducts` 数组：

```typescript
const customProduct = {
  id: 'custom_product',
  title: '你的产品名称',
  price: 1000,
  currency: 'USD',
  minBidRatio: 80, // 最低出价比例
  depositPercentage: 15, // 定金比例
  allowOptionalMessage: true
}
```

### 调整演示流程

修改 `src/components/BidWidget/BidWidget.tsx` 中的演示逻辑：

```typescript
if (isDemo) {
  // 自定义演示步骤
  toast.success('🎯 自定义提示信息')
  
  // 调整延迟时间
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  // 添加额外的演示步骤
  toast.success('🎉 额外的成功提示')
}
```

### 主题定制

```typescript
<BidWidget
  formId="demo-form"
  title={currentProduct.title}
  price={currentProduct.price}
  currency={currentProduct.currency}
  themeColor="#7C3AED" // 自定义主题色
  minBidRatio={currentProduct.minBidRatio}
  depositPercentage={currentProduct.depositPercentage}
  allowOptionalMessage={currentProduct.allowOptionalMessage}
/>
```

## 演示脚本

### 完整演示流程 (5分钟)

1. **介绍阶段** (1分钟)
   - 打开演示页面
   - 介绍产品信息和功能特点
   - 说明演示模式的特点

2. **表单填写** (2分钟)
   - 点击出价按钮
   - 演示表单验证功能
   - 展示实时计算功能
   - 填写完整信息

3. **支付流程** (1分钟)
   - 提交表单
   - 观看处理动画
   - 查看成功页面

4. **功能说明** (1分钟)
   - 解释真实模式的区别
   - 介绍商家管理功能
   - 回答问题

### 快速演示 (2分钟)

1. 直接填写表单并提交
2. 展示成功结果
3. 简要说明功能特点

## 常见问题

### Q: 演示模式下的数据会保存吗？
A: 演示数据只保存在浏览器的内存中，刷新页面后会重置。

### Q: 如何切换到真实模式？
A: 将 `.env` 文件中的 `VITE_DEMO_MODE` 设置为 `false`，并配置 Supabase 和 Stripe 密钥。

### Q: 演示模式支持多种货币吗？
A: 目前演示模式主要使用 USD，但可以通过修改演示数据来支持其他货币。

### Q: 可以自定义演示产品吗？
A: 可以，编辑 `src/stores/demoStore.ts` 文件中的产品数据即可。

### Q: 演示模式下会发送真实的网络请求吗？
A: 不会，所有的 API 调用都被模拟，不会产生真实的费用或数据。

## 故障排除

### 页面空白
- 检查控制台是否有 JavaScript 错误
- 确认 `VITE_DEMO_MODE=true` 设置正确
- 重启开发服务器

### 表单无法提交
- 检查表单验证是否通过
- 确认出价金额大于最低要求
- 查看控制台错误信息

### 样式显示异常
- 确认 Tailwind CSS 正确加载
- 检查浏览器兼容性
- 清除浏览器缓存

## 反馈和改进

如果你在使用演示模式时遇到问题或有改进建议，请：

1. 查看控制台错误信息
2. 记录重现步骤
3. 提交 Issue 或反馈
4. 包含浏览器和系统信息

演示模式是展示 BidForm 功能的重要工具，我们会持续改进用户体验。