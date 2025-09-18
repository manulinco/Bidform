-- 创建 bid_forms 表
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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_bid_forms_user_id ON public.bid_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_bid_forms_status ON public.bid_forms(status);
CREATE INDEX IF NOT EXISTS idx_bid_forms_created_at ON public.bid_forms(created_at);

-- 启用 RLS (Row Level Security)
ALTER TABLE public.bid_forms ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略
CREATE POLICY "Users can view their own bid forms" ON public.bid_forms
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bid forms" ON public.bid_forms
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bid forms" ON public.bid_forms
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bid forms" ON public.bid_forms
    FOR DELETE USING (auth.uid() = user_id);

-- 创建 bids 表来存储出价记录
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

-- 创建 bids 表索引
CREATE INDEX IF NOT EXISTS idx_bids_bid_form_id ON public.bids(bid_form_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_email ON public.bids(bidder_email);
CREATE INDEX IF NOT EXISTS idx_bids_created_at ON public.bids(created_at);

-- 启用 bids 表的 RLS
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- 创建 bids 表的 RLS 策略
CREATE POLICY "Bid form owners can view all bids" ON public.bids
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.bid_forms 
            WHERE id = bids.bid_form_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can insert bids" ON public.bids
    FOR INSERT WITH CHECK (true);

-- 创建更新 updated_at 的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为 bid_forms 表创建触发器
CREATE TRIGGER update_bid_forms_updated_at 
    BEFORE UPDATE ON public.bid_forms 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 为 bids 表创建触发器
CREATE TRIGGER update_bids_updated_at 
    BEFORE UPDATE ON public.bids 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();