-- 修复表名和字段名不匹配的问题
-- 在 Supabase SQL 编辑器中运行此脚本

-- 1. 检查现有表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%bid%' OR table_name LIKE '%form%' OR table_name LIKE '%offer%';

-- 2. 如果 bid_forms 表不存在，但存在其他相似表，创建 bid_forms 表
CREATE TABLE IF NOT EXISTS public.bid_forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    starting_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    deposit_percentage INTEGER DEFAULT 10 CHECK (deposit_percentage >= 0 AND deposit_percentage <= 100),
    minimum_bid_ratio INTEGER DEFAULT 70 CHECK (minimum_bid_ratio >= 0 AND minimum_bid_ratio <= 100),
    theme_color VARCHAR(7) DEFAULT '#ee5e3a',
    allow_messages BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 3. 如果存在旧的表结构，迁移数据
-- 检查是否存在 merchants 表和相关数据
DO $$
BEGIN
    -- 如果存在 merchants 表但没有 bid_forms 表的数据，创建测试数据
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'merchants') THEN
        -- 从 merchants 表迁移数据到 bid_forms（如果需要）
        -- 这里可以添加数据迁移逻辑
        NULL;
    END IF;
END $$;

-- 4. 创建索引
CREATE INDEX IF NOT EXISTS idx_bid_forms_user_id ON public.bid_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_bid_forms_status ON public.bid_forms(status);
CREATE INDEX IF NOT EXISTS idx_bid_forms_created_at ON public.bid_forms(created_at);

-- 5. 启用 RLS
ALTER TABLE public.bid_forms ENABLE ROW LEVEL SECURITY;

-- 6. 删除现有策略（如果存在）
DROP POLICY IF EXISTS "Users can view their own bid forms" ON public.bid_forms;
DROP POLICY IF EXISTS "Users can insert their own bid forms" ON public.bid_forms;
DROP POLICY IF EXISTS "Users can update their own bid forms" ON public.bid_forms;
DROP POLICY IF EXISTS "Users can delete their own bid forms" ON public.bid_forms;

-- 7. 创建新的 RLS 策略
CREATE POLICY "Users can view their own bid forms" ON public.bid_forms
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bid forms" ON public.bid_forms
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bid forms" ON public.bid_forms
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bid forms" ON public.bid_forms
    FOR DELETE USING (auth.uid() = user_id);

-- 8. 创建 bids 表（如果不存在）
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

-- 9. 创建 bids 表索引
CREATE INDEX IF NOT EXISTS idx_bids_bid_form_id ON public.bids(bid_form_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_email ON public.bids(bidder_email);
CREATE INDEX IF NOT EXISTS idx_bids_created_at ON public.bids(created_at);

-- 10. 启用 bids 表的 RLS
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- 11. 删除现有 bids 策略
DROP POLICY IF EXISTS "Bid form owners can view all bids" ON public.bids;
DROP POLICY IF EXISTS "Anyone can insert bids" ON public.bids;

-- 12. 创建 bids 表的 RLS 策略
CREATE POLICY "Bid form owners can view all bids" ON public.bids
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.bid_forms 
            WHERE id = bids.bid_form_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can insert bids" ON public.bids
    FOR INSERT WITH CHECK (true);

-- 13. 创建触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 14. 创建触发器
DROP TRIGGER IF EXISTS update_bid_forms_updated_at ON public.bid_forms;
CREATE TRIGGER update_bid_forms_updated_at 
    BEFORE UPDATE ON public.bid_forms 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bids_updated_at ON public.bids;
CREATE TRIGGER update_bids_updated_at 
    BEFORE UPDATE ON public.bids 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 15. 验证表创建
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('bid_forms', 'bids')
ORDER BY table_name, ordinal_position;