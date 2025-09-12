# API 契约（MVP）

所有接口均为 Serverless API，占位路径以 `/api/...` 表示。鉴权：商家端接口需商家登录态/令牌；买家端创建定金无需登录但需表单有效校验。

## 通用响应结构
- 成功：`{ success: true, data: ... }`
- 失败：`{ success: false, error: { code: string, message: string } }`

---

## 1) 创建定金意图与出价
POST /api/offers/create-deposit-intent

请求：
```
{
  "form_id": "uuid",
  "bid_amount": 1250.00,
  "buyer_name": "Alice",
  "buyer_email": "alice@example.com",
  "buyer_message": "我很喜欢，会长期使用",
  "agree_terms": true
}
```

校验：
- 表单存在且 active
- bid_amount ≥ base_price × min_bid_ratio
- agree_terms = true

处理：
- 计算 deposit = bid_amount × deposit_percentage
- 创建 Stripe PaymentIntent（Connect、application_fee、transfer_data）
- 预写/写入 offer（deposit_status=pending, deposit_pi_id）
- 返回 client_secret 给前端进行 confirm

响应：
```
{
  "success": true,
  "data": {
    "client_secret": "pi_***_secret",
    "deposit_amount": 125.00,
    "currency": "USD"
  }
}
```

错误码：
- FORM_NOT_FOUND / FORM_INACTIVE
- BID_TOO_LOW
- TERMS_NOT_ACCEPTED
- STRIPE_ERROR

---

## 2) 商家接受出价（生成尾款意图）
POST /api/offers/accept

请求：
```
{
  "offer_id": "uuid"
}
```

前置：
- offer.deposit_status === "succeeded"
- offer.final_status !== "succeeded"

处理：
- 计算 final = bid_amount - deposit_amount
- 创建 Stripe PaymentIntent（Connect）
- 更新 offer.final_pi_id, final_status="pending"
- 返回尾款支付链接或 client_secret

响应：
```
{
  "success": true,
  "data": {
    "final_amount": 1125.00,
    "currency": "USD",
    "client_secret": "pi_***_secret"
  }
}
```

错误码：
- OFFER_NOT_FOUND
- DEPOSIT_NOT_PAID
- ALREADY_FINALIZED
- STRIPE_ERROR

---

## 3) 商家拒绝出价（定金退款）
POST /api/offers/reject

请求：
```
{
  "offer_id": "uuid",
  "reason": "不符合预期"
}
```

前置：
- offer.deposit_status === "succeeded"

处理：
- 发起对 deposit_pi_id 的退款
- 更新 offer.deposit_status="refunded", offer.status="rejected"
- 记录 payments 退款流水

响应：
```
{ "success": true }
```

错误码：
- OFFER_NOT_FOUND
- DEPOSIT_NOT_PAID
- REFUND_FAILED

---

## 4) 查询表单的有效出价（仅商家）
GET /api/offers/list?form_id=UUID&onlyPaid=true

响应：
```
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "bid_amount": 1250.00,
      "buyer_name": "Alice",
      "buyer_email": "alice@example.com",
      "buyer_message": "我很喜欢",
      "deposit_status": "succeeded",
      "final_status": "pending"
    }
  ]
}
```

---

## 安全与幂等
- 使用 Stripe Idempotency-Key（以 offer_id / deposit_pi_id 作为幂等因子）
- 商家端接口校验 merchant_id 与表单归属
- 买家端限制同邮箱在短时间内重复出价