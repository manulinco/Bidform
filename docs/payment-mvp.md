# 支付流程与计算（MVP）

## 1. 金额计算
- 出价：`bid_amount`
- 定金比例：`deposit_percentage`（默认 10%）
- 定金金额：`deposit_amount = round(bid_amount * deposit_percentage / 100, 2)`
- 尾款金额：`final_amount = bid_amount - deposit_amount`

## 2. 平台抽成（示例）
- 统一抽成比例：`platform_fee_percentage = 5%`
- 在创建 PaymentIntent 时设置 `application_fee_amount`：
  - 对应金额 = round(intent_amount * platform_fee_percentage, 最小货币单位)
- 使用 Stripe Connect `transfer_data.destination = merchant.stripe_account_id`

## 3. Stripe 建议参数（参考）
- PaymentIntent
  - amount：以最小货币单位（分）传入
  - currency：与表单一致（例如 `usd`）
  - capture_method：默认 automatic
  - metadata：form_id, offer_id, type=deposit|final, merchant_id
  - transfer_group：`form_{id}`（便于对账）
  - application_fee_amount：平台抽成（可按计划差异调整，MVP统一）

## 4. 事件与状态
- 定金成功 → offers.deposit_status = succeeded，记 payments 一笔
- 定金退款 → offers.deposit_status = refunded，payments 记退款
- 尾款成功 → offers.final_status = succeeded，交易完成
- 错误/失败 → 记录失败原因到日志表（可选）

## 5. 流程时序（简版）
1) Widget 请求 create-deposit-intent
2) Stripe 前端 confirm 成功
3) 回传成功结果给后端（或由 Webhook 更新）→ 写库
4) 商家接受 → 生成尾款意图
5) 买家完成尾款支付 → 写库完成

## 6. 对账与幂等（MVP）
- 前端确认成功后立即调用后端“落库”接口（或复用创建接口的回传分支）
- 先不接 Webhook；待稳定后补 Webhook 做最终一致性