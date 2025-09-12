-- BidForm Database Schema
-- 创建时间: 2025-09-10
-- 版本: 1.0.0

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 商户表
CREATE TABLE merchants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  website_url VARCHAR(500),
  stripe_account_id VARCHAR(255), -- Stripe Connect账户ID
  stripe_onboarding_completed BOOLEAN DEFAULT FALSE,
  subscription_plan VARCHAR(50) DEFAULT 'free', -- free, basic, pro
  subscription_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 投标表单表
CREATE TABLE bid_forms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  product_name VARCHAR(255) NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  min_bid_amount DECIMAL(10,2),
  max_bid_amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  quantity_available INTEGER DEFAULT 1,
  bid_end_date TIMESTAMP WITH TIME ZONE,
  auto_accept_threshold DECIMAL(10,2), -- 自动接受的价格阈值
  deposit_percentage DECIMAL(5,2) DEFAULT 10.00, -- 预付款百分比
  theme_color VARCHAR(7) DEFAULT '#3B82F6', -- 主题颜色
  custom_css TEXT, -- 自定义样式
  embed_code TEXT, -- 生成的嵌入代码
  status VARCHAR(20) DEFAULT 'active', -- active, paused, ended
  total_bids INTEGER DEFAULT 0,
  highest_bid DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 投标记录表
CREATE TABLE offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bid_form_id UUID REFERENCES bid_forms(id) ON DELETE CASCADE,
  bidder_name VARCHAR(255) NOT NULL,
  bidder_email VARCHAR(255) NOT NULL,
  bidder_phone VARCHAR(50),
  bid_amount DECIMAL(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  message TEXT,
  deposit_amount DECIMAL(10,2) NOT NULL, -- 预付款金额
  remaining_amount DECIMAL(10,2) NOT NULL, -- 剩余金额
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, completed, cancelled
  payment_intent_id VARCHAR(255), -- Stripe PaymentIntent ID
  deposit_payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed
  final_payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed
  accepted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 支付记录表
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_type VARCHAR(20) NOT NULL, -- deposit, final
  status VARCHAR(20) DEFAULT 'pending', -- pending, succeeded, failed, cancelled
  stripe_fee DECIMAL(10,2), -- Stripe手续费
  platform_fee DECIMAL(10,2), -- 平台手续费
  merchant_amount DECIMAL(10,2), -- 商户实收金额
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 通知表
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- new_bid, bid_accepted, payment_received
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  related_offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 系统设置表
CREATE TABLE system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入默认系统设置
INSERT INTO system_settings (key, value, description) VALUES
('platform_fee_percentage', '5.0', '平台手续费百分比'),
('stripe_fee_percentage', '2.9', 'Stripe手续费百分比'),
('stripe_fee_fixed', '0.30', 'Stripe固定手续费(美元)'),
('max_bid_forms_free', '5', '免费计划最大表单数'),
('max_bid_forms_basic', '50', '基础计划最大表单数'),
('max_bid_forms_pro', '1000', '专业计划最大表单数');

-- 创建索引
CREATE INDEX idx_merchants_user_id ON merchants(user_id);
CREATE INDEX idx_merchants_email ON merchants(email);
CREATE INDEX idx_bid_forms_merchant_id ON bid_forms(merchant_id);
CREATE INDEX idx_bid_forms_status ON bid_forms(status);
CREATE INDEX idx_offers_bid_form_id ON offers(bid_form_id);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_offers_bidder_email ON offers(bidder_email);
CREATE INDEX idx_payments_offer_id ON payments(offer_id);
CREATE INDEX idx_payments_merchant_id ON payments(merchant_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_notifications_merchant_id ON notifications(merchant_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加更新时间触发器
CREATE TRIGGER update_merchants_updated_at BEFORE UPDATE ON merchants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bid_forms_updated_at BEFORE UPDATE ON bid_forms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 行级安全策略 (RLS)
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 商户只能访问自己的数据
CREATE POLICY "Merchants can only access their own data" ON merchants
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Merchants can only access their own bid forms" ON bid_forms
  FOR ALL USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

-- 投标记录：商户可以查看自己表单的投标，投标者可以查看自己的投标
CREATE POLICY "Merchants can view offers for their forms" ON offers
  FOR SELECT USING (bid_form_id IN (
    SELECT bf.id FROM bid_forms bf 
    JOIN merchants m ON bf.merchant_id = m.id 
    WHERE m.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can create offers" ON offers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Merchants can update offers for their forms" ON offers
  FOR UPDATE USING (bid_form_id IN (
    SELECT bf.id FROM bid_forms bf 
    JOIN merchants m ON bf.merchant_id = m.id 
    WHERE m.user_id = auth.uid()
  ));

-- 支付记录：只有相关商户可以访问
CREATE POLICY "Merchants can only access their own payments" ON payments
  FOR ALL USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

-- 通知：只有相关商户可以访问
CREATE POLICY "Merchants can only access their own notifications" ON notifications
  FOR ALL USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

-- 创建视图：投标表单统计
CREATE VIEW bid_form_stats AS
SELECT 
  bf.id,
  bf.title,
  bf.status,
  COUNT(o.id) as total_offers,
  MAX(o.bid_amount) as highest_bid,
  AVG(o.bid_amount) as average_bid,
  SUM(CASE WHEN o.status = 'accepted' THEN o.bid_amount ELSE 0 END) as total_accepted_value,
  COUNT(CASE WHEN o.status = 'accepted' THEN 1 END) as accepted_offers
FROM bid_forms bf
LEFT JOIN offers o ON bf.id = o.bid_form_id
GROUP BY bf.id, bf.title, bf.status;

-- 创建视图：商户仪表板统计
CREATE VIEW merchant_dashboard_stats AS
SELECT 
  m.id as merchant_id,
  COUNT(DISTINCT bf.id) as total_forms,
  COUNT(DISTINCT o.id) as total_offers,
  COUNT(CASE WHEN o.status = 'accepted' THEN 1 END) as accepted_offers,
  SUM(CASE WHEN p.status = 'succeeded' THEN p.merchant_amount ELSE 0 END) as total_revenue,
  COUNT(CASE WHEN bf.status = 'active' THEN 1 END) as active_forms
FROM merchants m
LEFT JOIN bid_forms bf ON m.id = bf.merchant_id
LEFT JOIN offers o ON bf.id = o.bid_form_id
LEFT JOIN payments p ON o.id = p.offer_id
GROUP BY m.id;

-- 创建函数：生成嵌入代码
CREATE OR REPLACE FUNCTION generate_embed_code(form_id UUID)
RETURNS TEXT AS $$
DECLARE
  embed_code TEXT;
BEGIN
  embed_code := format(
    '<script src="https://cdn.bidform.online/widget.js" data-form-id="%s" async></script><div id="bidform-widget-%s"></div>',
    form_id,
    form_id
  );
  
  UPDATE bid_forms SET embed_code = embed_code WHERE id = form_id;
  
  RETURN embed_code;
END;
$$ LANGUAGE plpgsql;

-- 创建函数：计算平台手续费
CREATE OR REPLACE FUNCTION calculate_platform_fee(amount DECIMAL, plan VARCHAR)
RETURNS DECIMAL AS $$
DECLARE
  fee_percentage DECIMAL;
BEGIN
  CASE plan
    WHEN 'free' THEN fee_percentage := 5.0;
    WHEN 'basic' THEN fee_percentage := 0.0;
    WHEN 'pro' THEN fee_percentage := 0.0;
    ELSE fee_percentage := 5.0;
  END CASE;
  
  RETURN ROUND(amount * fee_percentage / 100, 2);
END;
$$ LANGUAGE plpgsql;

-- 创建触发器：自动更新投标统计
CREATE OR REPLACE FUNCTION update_bid_form_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE bid_forms 
    SET 
      total_bids = total_bids + 1,
      highest_bid = GREATEST(highest_bid, NEW.bid_amount)
    WHERE id = NEW.bid_form_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- 重新计算统计数据
    UPDATE bid_forms 
    SET 
      total_bids = (SELECT COUNT(*) FROM offers WHERE bid_form_id = NEW.bid_form_id),
      highest_bid = (SELECT COALESCE(MAX(bid_amount), 0) FROM offers WHERE bid_form_id = NEW.bid_form_id)
    WHERE id = NEW.bid_form_id;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_bid_form_stats
  AFTER INSERT OR UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION update_bid_form_stats();

-- 创建触发器：自动生成嵌入代码
CREATE OR REPLACE FUNCTION auto_generate_embed_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.embed_code := generate_embed_code(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_embed_code
  BEFORE INSERT ON bid_forms
  FOR EACH ROW EXECUTE FUNCTION auto_generate_embed_code();