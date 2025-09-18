-- 验证修复是否成功
-- 在 Supabase SQL 编辑器中运行此脚本

-- 1. 检查 bid_forms 表的字段
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'bid_forms'
ORDER BY ordinal_position;

-- 2. 检查是否存在必要的字段
SELECT 
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bid_forms' AND column_name = 'starting_price'
    ) THEN '✅ starting_price 存在' ELSE '❌ starting_price 缺失' END as starting_price_check,
    
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bid_forms' AND column_name = 'minimum_bid_ratio'
    ) THEN '✅ minimum_bid_ratio 存在' ELSE '❌ minimum_bid_ratio 缺失' END as minimum_bid_ratio_check,
    
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bid_forms' AND column_name = 'allow_messages'
    ) THEN '✅ allow_messages 存在' ELSE '❌ allow_messages 缺失' END as allow_messages_check,
    
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bid_forms' AND column_name = 'user_id'
    ) THEN '✅ user_id 存在' ELSE '❌ user_id 缺失' END as user_id_check;

-- 3. 检查视图是否存在
SELECT 
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.views 
        WHERE table_name = 'bid_forms_api'
    ) THEN '✅ bid_forms_api 视图存在' ELSE '❌ bid_forms_api 视图缺失' END as view_check;

-- 4. 检查函数是否存在
SELECT 
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.routines 
        WHERE routine_name = 'create_bid_form_api'
    ) THEN '✅ create_bid_form_api 函数存在' ELSE '❌ create_bid_form_api 函数缺失' END as function_check;

-- 5. 检查 RLS 策略
SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'bid_forms'
AND policyname LIKE '%user_id%';

-- 6. 测试当前用户
SELECT 
    auth.uid() as current_user_id,
    CASE WHEN auth.uid() IS NOT NULL 
         THEN '✅ 用户已认证' 
         ELSE '❌ 用户未认证' 
    END as auth_status;

-- 7. 检查 merchants 表
SELECT COUNT(*) as merchant_count FROM merchants;

-- 8. 检查 bid_forms 表
SELECT COUNT(*) as bid_forms_count FROM bid_forms;

-- 9. 如果有数据，显示示例记录
SELECT 
    id,
    title,
    COALESCE(starting_price, base_price) as price,
    currency,
    status,
    created_at
FROM bid_forms 
ORDER BY created_at DESC 
LIMIT 3;