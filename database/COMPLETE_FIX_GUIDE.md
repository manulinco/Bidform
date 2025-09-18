# 完整修复指南 - 解决 "Could not find table 'public.bid_forms'" 错误

## 问题分析

错误 `Could not find the table 'public.bid_forms' in the schema cache` 表明：
1. 数据库表结构与应用期望的字段名不匹配
2. 现有表使用 `base_price` 而应用期望 `starting_price`
3. 字段类型和命名约定不一致

## 🚀 立即修复步骤

### 步骤 1: 执行修复脚本

在 Supabase SQL 编辑器中执行以下脚本：

```sql
-- 复制 database/fix_current_schema.sql 的完整内容并执行
```

### 步骤 2: 验证修复

执行验证脚本：

```sql
-- 复制 database/verify_fix.sql 的内容并执行
```

### 步骤 3: 重启应用

修复完成后，重启你的应用以清除任何缓存。

## 📋 修复内容详解

### 1. 字段兼容性
- ✅ 添加 `starting_price` 字段（映射到 `base_price`）
- ✅ 添加 `minimum_bid_ratio` 字段（映射到 `min_bid_ratio`）
- ✅ 添加 `allow_messages` 字段（映射到 `allow_optional_message`）
- ✅ 添加 `user_id` 字段（从 merchants 表关联）

### 2. 数据库函数
- ✅ `create_bid_form_api()` - 处理产品创建
- ✅ 自动创建 merchant 记录（如果不存在）
- ✅ 字段映射和类型转换

### 3. 兼容视图
- ✅ `bid_forms_api` 视图提供统一的字段接口
- ✅ 向后兼容现有数据结构

### 4. 安全策略
- ✅ 更新 RLS 策略支持 `user_id` 字段
- ✅ 保持数据隔离和安全性

### 5. API 更新
- ✅ 新的 `src/api/products.ts` 使用数据库函数
- ✅ 错误处理和回退机制
- ✅ 类型安全的接口

## 🔍 验证清单

执行 `verify_fix.sql` 后，确认以下项目：

- [ ] ✅ starting_price 存在
- [ ] ✅ minimum_bid_ratio 存在  
- [ ] ✅ allow_messages 存在
- [ ] ✅ user_id 存在
- [ ] ✅ bid_forms_api 视图存在
- [ ] ✅ create_bid_form_api 函数存在
- [ ] ✅ 用户已认证
- [ ] ✅ RLS 策略正确

## 🧪 测试创建产品

修复完成后，测试创建产品功能：

1. 登录应用
2. 进入 Dashboard
3. 点击 "Create Product" 
4. 填写产品信息
5. 提交表单

如果仍有错误，检查浏览器控制台的详细错误信息。

## 🔧 故障排除

### 错误：函数不存在
```sql
-- 重新创建函数
DROP FUNCTION IF EXISTS create_bid_form_api;
-- 然后重新执行 fix_current_schema.sql 中的函数定义
```

### 错误：权限不足
```sql
-- 检查当前用户权限
SELECT current_user, session_user;
-- 确保以 postgres 用户或具有足够权限的用户执行
```

### 错误：字段类型不匹配
```sql
-- 检查字段类型
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bid_forms';
```

## 📞 获取帮助

如果问题持续存在，请提供：

1. `verify_fix.sql` 的完整执行结果
2. 浏览器控制台的错误信息
3. Supabase 项目的 URL（不包含密钥）
4. 应用的错误截图

## 🎯 预期结果

修复成功后，你应该能够：
- ✅ 正常创建产品
- ✅ 查看产品列表
- ✅ 编辑产品信息
- ✅ 生成分享链接
- ✅ 接收出价信息

修复完成！🎉