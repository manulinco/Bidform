import { supabase } from '../lib/supabase';

// 创建基础表的 SQL 脚本
const createTablesSQL = `
-- 创建 bid_forms 表
CREATE TABLE IF NOT EXISTS public.bid_forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    product_name VARCHAR(255),
    base_price DECIMAL(10,2) NOT NULL,
    starting_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    deposit_percentage INTEGER DEFAULT 10,
    minimum_bid_ratio INTEGER DEFAULT 70,
    min_bid_ratio DECIMAL(5,2) DEFAULT 70.00,
    theme_color VARCHAR(7) DEFAULT '#3B82F6',
    allow_messages BOOLEAN DEFAULT true,
    allow_optional_message BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 bids 表
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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_bid_forms_user_id ON public.bid_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_bid_forms_status ON public.bid_forms(status);
CREATE INDEX IF NOT EXISTS idx_bids_bid_form_id ON public.bids(bid_form_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_email ON public.bids(bidder_email);

-- 启用 RLS
ALTER TABLE public.bid_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略
DROP POLICY IF EXISTS "Users can view their own bid forms" ON public.bid_forms;
CREATE POLICY "Users can view their own bid forms" ON public.bid_forms
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own bid forms" ON public.bid_forms;
CREATE POLICY "Users can insert their own bid forms" ON public.bid_forms
    FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own bid forms" ON public.bid_forms;
CREATE POLICY "Users can update their own bid forms" ON public.bid_forms
    FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own bid forms" ON public.bid_forms;
CREATE POLICY "Users can delete their own bid forms" ON public.bid_forms
    FOR DELETE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Bid form owners can view all bids" ON public.bids;
CREATE POLICY "Bid form owners can view all bids" ON public.bids
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.bid_forms 
            WHERE id = bids.bid_form_id 
            AND user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Anyone can insert bids" ON public.bids;
CREATE POLICY "Anyone can insert bids" ON public.bids
    FOR INSERT WITH CHECK (true);
`;

export async function initializeDatabase(): Promise<boolean> {
  try {
    console.log('🔧 Initializing database...');
    
    // 检查当前用户是否已登录
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('❌ User not authenticated, skipping database initialization');
      return false;
    }

    // 尝试查询 bid_forms 表来检查是否存在
    const { data: testData, error: testError } = await supabase
      .from('bid_forms')
      .select('id')
      .limit(1);

    if (!testError) {
      console.log('✅ Database tables already exist');
      return true;
    }

    console.log('📋 Tables not found, attempting to create them...');
    
    // 由于我们无法直接执行 DDL，我们需要通过其他方式
    // 让我们尝试创建一个简单的记录来触发表的创建
    console.log('⚠️ Cannot create tables directly from client. Please run the SQL script manually.');
    console.log('📝 SQL Script needed:');
    console.log(createTablesSQL);
    
    return false;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

export async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    return !error;
  } catch {
    return false;
  }
}

export async function getDatabaseStatus() {
  const tables = ['bid_forms', 'bids'];
  const status: Record<string, boolean> = {};
  
  for (const table of tables) {
    status[table] = await checkTableExists(table);
  }
  
  console.log('📊 Database Status:', status);
  return status;
}

// 自动检查数据库状态
if (import.meta.env.DEV) {
  setTimeout(async () => {
    await getDatabaseStatus();
    const initialized = await initializeDatabase();
    if (!initialized) {
      console.log('🚨 Database needs manual setup. Please run the SQL script in Supabase dashboard.');
    }
  }, 1000);
}