-- 快速修复脚本 - 创建缺失的函数和字段
-- 在 Supabase SQL 编辑器中执行此脚本

-- 1. 添加缺失的字段到 bid_forms 表
DO $$
BEGIN
  -- 添加 starting_price 字段（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='bid_forms' AND column_name='starting_price'
  ) THEN
    ALTER TABLE bid_forms ADD COLUMN starting_price DECIMAL(10,2);
    UPDATE bid_forms SET starting_price = base_price WHERE starting_price IS NULL;
  END IF;

  -- 添加 minimum_bid_ratio 字段（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='bid_forms' AND column_name='minimum_bid_ratio'
  ) THEN
    ALTER TABLE bid_forms ADD COLUMN minimum_bid_ratio INTEGER DEFAULT 70;
  END IF;

  -- 添加 allow_messages 字段（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='bid_forms' AND column_name='allow_messages'
  ) THEN
    ALTER TABLE bid_forms ADD COLUMN allow_messages BOOLEAN DEFAULT true;
  END IF;

  -- 添加 user_id 字段（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='bid_forms' AND column_name='user_id'
  ) THEN
    ALTER TABLE bid_forms ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    -- 从现有的 merchant_id 关联更新 user_id
    UPDATE bid_forms SET user_id = (
      SELECT user_id FROM merchants WHERE merchants.id = bid_forms.merchant_id
    ) WHERE user_id IS NULL;
  END IF;
END $$;

-- 2. 创建 create_bid_form_api 函数
CREATE OR REPLACE FUNCTION create_bid_form_api(
  p_title VARCHAR(255),
  p_description TEXT DEFAULT NULL,
  p_starting_price DECIMAL(10,2),
  p_currency VARCHAR(3) DEFAULT 'USD',
  p_deposit_percentage INTEGER DEFAULT 10,
  p_minimum_bid_ratio INTEGER DEFAULT 70,
  p_theme_color VARCHAR(7) DEFAULT '#ee5e3a',
  p_allow_messages BOOLEAN DEFAULT true,
  p_user_id UUID DEFAULT NULL
) RETURNS TABLE(
  id UUID,
  title VARCHAR(255),
  description TEXT,
  starting_price DECIMAL(10,2),
  currency VARCHAR(3),
  deposit_percentage INTEGER,
  minimum_bid_ratio INTEGER,
  theme_color VARCHAR(7),
  allow_messages BOOLEAN,
  status VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  user_id UUID
) AS $$
DECLARE
  v_merchant_id UUID;
  v_user_id UUID;
  v_bid_form_id UUID;
BEGIN
  -- 获取当前用户ID
  v_user_id := COALESCE(p_user_id, auth.uid());
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  
  -- 获取或创建商户记录
  SELECT merchants.id INTO v_merchant_id 
  FROM merchants 
  WHERE merchants.user_id = v_user_id;
  
  IF v_merchant_id IS NULL THEN
    -- 获取用户邮箱
    INSERT INTO merchants (user_id, email, name, subscription_plan, subscription_status)
    VALUES (
      v_user_id, 
      COALESCE((SELECT email FROM auth.users WHERE auth.users.id = v_user_id), 'user@example.com'),
      'User',
      'free',
      'active'
    )
    RETURNING merchants.id INTO v_merchant_id;
  END IF;
  
  -- 创建 bid_form 记录
  INSERT INTO bid_forms (
    merchant_id,
    title,
    description,
    product_name,
    base_price,
    starting_price,
    currency,
    deposit_percentage,
    minimum_bid_ratio,
    theme_color,
    allow_messages,
    status,
    user_id
  ) VALUES (
    v_merchant_id,
    p_title,
    p_description,
    p_title, -- 使用 title 作为 product_name
    p_starting_price,
    p_starting_price,
    p_currency,
    p_deposit_percentage,
    p_minimum_bid_ratio,
    p_theme_color,
    p_allow_messages,
    'active',
    v_user_id
  )
  RETURNING bid_forms.id INTO v_bid_form_id;
  
  -- 返回创建的记录
  RETURN QUERY
  SELECT 
    bf.id,
    bf.title,
    bf.description,
    COALESCE(bf.starting_price, bf.base_price) as starting_price,
    bf.currency,
    COALESCE(bf.deposit_percentage::INTEGER, 10) as deposit_percentage,
    COALESCE(bf.minimum_bid_ratio, 70) as minimum_bid_ratio,
    bf.theme_color,
    COALESCE(bf.allow_messages, true) as allow_messages,
    bf.status,
    bf.created_at,
    bf.updated_at,
    bf.user_id
  FROM bid_forms bf
  WHERE bf.id = v_bid_form_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 创建兼容视图
CREATE OR REPLACE VIEW public.bid_forms_api AS
SELECT 
  id,
  title,
  description,
  COALESCE(starting_price, base_price) as starting_price,
  currency,
  COALESCE(deposit_percentage::INTEGER, 10) as deposit_percentage,
  COALESCE(minimum_bid_ratio, 70) as minimum_bid_ratio,
  theme_color,
  COALESCE(allow_messages, true) as allow_messages,
  status,
  created_at,
  updated_at,
  COALESCE(user_id, (SELECT user_id FROM merchants WHERE merchants.id = bid_forms.merchant_id)) as user_id,
  merchant_id
FROM bid_forms;

-- 4. 更新 RLS 策略
DROP POLICY IF EXISTS "Users can view their own bid forms via user_id" ON bid_forms;
CREATE POLICY "Users can view their own bid forms via user_id" ON bid_forms
  FOR SELECT USING (
    user_id = auth.uid() OR 
    merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert their own bid forms via user_id" ON bid_forms;
CREATE POLICY "Users can insert their own bid forms via user_id" ON bid_forms
  FOR INSERT WITH CHECK (
    user_id = auth.uid() OR 
    merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update their own bid forms via user_id" ON bid_forms;
CREATE POLICY "Users can update their own bid forms via user_id" ON bid_forms
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
  );

-- 5. 验证修复
SELECT 
  'bid_forms字段检查' as check_type,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'bid_forms'
AND column_name IN ('starting_price', 'minimum_bid_ratio', 'allow_messages', 'user_id')
ORDER BY column_name;

-- 检查函数是否存在
SELECT 
  'create_bid_form_api函数检查' as check_type,
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'create_bid_form_api';