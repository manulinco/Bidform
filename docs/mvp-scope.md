# 出价意愿表单工具 — MVP 范围说明

版本目标：极简可用，围绕“出价 + 预付定金 + 商家反选 + 尾款”四步闭环，保持现有网站框架与样式不变，仅做增量功能。

## 1. 目标功能（必须有）
- 买家端（Widget）
  - 填写：出价金额、姓名、邮箱（或手机号）、可选留言、同意条款勾选
  - 校验：出价金额 ≥ 估值 × 最低比例
  - 支付：预付定金（比例由表单配置，默认 10%）
  - 结果：支付成功后记录为“已付定金的出价”，等待商家处理
- 商家端（Dashboard）
  - 列表：仅显示“已付定金”的出价
  - 动作：接受 或 拒绝
  - 接受：生成尾款支付意图与链接
  - 拒绝：自动发起定金退款，关闭该出价
- 支付与记账
  - Stripe Connect 分账，平台统一抽成（如 5%）
  - 记录定金与尾款两类流水

## 2. 非目标（本期不做）
- 自动过期定时任务（由商家手动处理；尾款期限仅展示提醒）
- 还价、聊天、信誉/申诉系统
- 复杂订阅/配额/多费率策略
- 多币种结算（使用单一货币配置）
- Webhook 幂等与对账完善（MVP 可先依赖前端确认 + 后端落库，后续补齐）

## 3. 数据结构增量（不破坏现有）
- bid_forms 新增：
  - min_bid_ratio DECIMAL(5,2) 默认 50.00
  - deposit_percentage DECIMAL(5,2) 默认 10.00
  - allow_optional_message BOOLEAN 默认 true
  - final_payment_deadline_hours INTEGER 默认 48（仅展示）
- offers 新增：
  - buyer_message TEXT
  - deposit_pi_id VARCHAR(255), deposit_status VARCHAR(20) pending|succeeded|failed|refunded
  - final_pi_id VARCHAR(255), final_status VARCHAR(20) pending|succeeded|failed|canceled
- payments 保持，按类型标记 deposit / final

## 4. 关键流程（摘要）
1) 买家提交出价 → 创建定金 PaymentIntent → 前端确认成功 → 记录 offer（deposit_status=succeeded）
2) 商家在 Dashboard 接受 → 生成尾款 PaymentIntent → 返回买家支付链接
3) 商家在 Dashboard 拒绝 → 自动退款定金 → 关闭 offer
4) 买家支付尾款成功 → 标记 final_status=succeeded → 线下交付

## 5. 风险与约束
- 明确定金规则文案，降低纠纷
- 列表严格筛选 deposit_status=succeeded，避免垃圾出价
- 先不做自动过期，减少后台复杂度