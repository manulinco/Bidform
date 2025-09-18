-- 修复当前数据库结构以支持新的产品创建功能
-- 基于现有的 schema.sql 和 patch_mvp_2025_09_11.sql

-- 1. 确保所有必要的字段都存在于 bid_forms 表中
DO $$
BEGIN
  -- 检查并添加缺失的字段
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='bid_forms' AND column_name='starting_price'
  ) THEN
    -- 如果没有 starting_price，但有 base_price，添加别名或重命名
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name='bid_forms' AND column_name='base_price'
    ) THEN
      EXECUTE 'ALTER TABLE bid_forms ADD COLUMN starting_price DECIMAL(10,2)';
      EXECUTE 'UPDATE bid_forms SET starting_price = base_price WHERE starting_price IS NULL';
    ELSE
      EXECUTE 'ALTER TABLE bid_forms ADD COLUMN starting_price DECIMAL(10,2) NOT NULL DEFAULT 0';
    END IF;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='bid_forms' AND column_name='minimum_bid_ratio'
  ) THEN
    -- 如果没有 minimum_bid_ratio，但有 min_bid_ratio，添加别名
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name='bid_forms' AND column_name='min_bid_ratio'
    ) THEN
      EXECUTE 'ALTER TABLE bid_forms ADD COLUMN minimum_bid_ratio INTEGER';
      EXECUTE 'UPDATE bid_forms SET minimum_bid_ratio = CAST(min_bid_ratio AS INTEGER) WHERE minimum_bid_ratio IS NULL';
    ELSE
      EXECUTE 'ALTER TABLE bid_forms ADD COLUMN minimum_bid_ratio INTEGER DEFAULT 70';
    END IF;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='bid_forms' AND column_name='allow_messages'
  ) THEN
    -- 如果没有 allow_messages，但有 allow_optional_message，添加别名
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name='bid_forms' AND column_name='allow_optional_message'
    ) THEN
      EXECUTE 'ALTER TABLE bid_forms ADD COLUMN allow_messages BOOLEAN';
      EXECUTE 'UPDATE bid_forms SET allow_messages = allow_optional_message WHERE allow_messages IS NULL';
    ELSE
      EXECUTE 'ALTER TABLE bid_forms ADD COLUMN allow_messages BOOLEAN DEFAULT true';
    END IF;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='bid_forms' AND column_name='user_id'
  ) THEN
    -- 添加 user_id 字段，从 merchants 表关联获取
    EXECUTE 'ALTER TABLE bid_forms ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE';
    
    -- 从现有的 merchant_id 关联更新 user_id
    EXECUTE 'UPDATE bid_forms SET user_id = (SELECT user_id FROM merchants WHERE merchants.id = bid_forms.merchant_id) WHERE user_id IS NULL';
  END IF;

  -- 确保 deposit_percentage 是整数类型
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='bid_forms' AND column_name='deposit_percentage' AND data_type = 'numeric'
  ) THEN
    EXECUTE 'ALTER TABLE bid_forms ALTER COLUMN deposit_percentage TYPE INTEGER USING CAST(deposit_percentage AS INTEGER)';
  END IF;

END $$;

-- 2. 创建视图以兼容新的 API 期望的字段名
CREATE OR REPLACE VIEW public.bid_forms_api AS
SELECT 
  id,
  title,
  description,
  COALESCE(starting_price, base_price) as starting_price,
  currency,
  COALESCE(deposit_percentage, 10) as deposit_percentage,
  COALESCE(minimum_bid_ratio, CAST(min_bid_ratio AS INTEGER), 70) as minimum_bid_ratio,
  theme_color,
  COALESCE(allow_messages, allow_optional_message, true) as allow_messages,
  status,
  created_at,
  updated_at,
  COALESCE(user_id, (SELECT user_id FROM merchants WHERE merchants.id = bid_forms.merchant_id)) as user_id,
  merchant_id
FROM bid_forms;

-- 3. 创建函数来处理新的产品创建
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
    min_bid_ratio,
    minimum_bid_ratio,
    theme_color,
    allow_optional_message,
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
    p_minimum_bid_ratio,
    p_theme_color,
    p_allow_messages,
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
    COALESCE(bf.deposit_percentage, 10) as deposit_percentage,
    COALESCE(bf.minimum_bid_ratio, CAST(bf.min_bid_ratio AS INTEGER), 70) as minimum_bid_ratio,
    bf.theme_color,
    COALESCE(bf.allow_messages, bf.allow_optional_message, true) as allow_messages,
    bf.status,
    bf.created_at,
    bf.updated_at,
    bf.user_id
  FROM bid_forms bf
  WHERE bf.id = v_bid_form_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. 更新 RLS 策略以支持新的字段
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

DROP POLICY IF EXISTS "Users can delete their own bid forms via user_id" ON bid_forms;
CREATE POLICY "Users can delete their own bid forms via user_id" ON bid_forms
  FOR DELETE USING (
    user_id = auth.uid() OR 
    merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
  );

-- 5. 创建兼容的 bids 表（如果不存在）
CREATE TABLE IF NOT EXISTS public.bids (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bid_form_id UUID REFERENCES public.bid_forms(id) ON DELETE CASCADE,
    bidder_email VARCHAR(255) NOT NULL,
    bidder_name VARCHAR(255),
    bid_amount DECIMAL(10,2) NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'withdrawn', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 创建 bids 表的索引和 RLS
CREATE INDEX IF NOT EXISTS idx_bids_bid_form_id ON public.bids(bid_form_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_email ON public.bids(bidder_email);

ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Bid form owners can view all bids" ON public.bids;
CREATE POLICY "Bid form owners can view all bids" ON public.bids
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.bid_forms 
            WHERE id = bids.bid_form_id 
            AND (user_id = auth.uid() OR merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
        )
    );

DROP POLICY IF EXISTS "Anyone can insert bids" ON public.bids;
CREATE POLICY "Anyone can insert bids" ON public.bids
    FOR INSERT WITH CHECK (true);

-- 7. 验证设置
SELECT 
  'bid_forms' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'bid_forms'
AND column_name IN ('starting_price', 'minimum_bid_ratio', 'allow_messages', 'user_id')
ORDER BY column_name;