-- MVP minimal patch: add fields if not exist and create one sample bid form
-- Safe to run multiple times (uses IF NOT EXISTS guards where possible)

-- 1) bid_forms: minimal new columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='bid_forms' AND column_name='min_bid_ratio'
  ) THEN
    EXECUTE 'ALTER TABLE bid_forms ADD COLUMN min_bid_ratio DECIMAL(5,2) DEFAULT 50.00';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='bid_forms' AND column_name='deposit_percentage'
  ) THEN
    EXECUTE 'ALTER TABLE bid_forms ADD COLUMN deposit_percentage DECIMAL(5,2) DEFAULT 10.00';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='bid_forms' AND column_name='allow_optional_message'
  ) THEN
    EXECUTE 'ALTER TABLE bid_forms ADD COLUMN allow_optional_message BOOLEAN DEFAULT TRUE';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='bid_forms' AND column_name='final_payment_deadline_hours'
  ) THEN
    EXECUTE 'ALTER TABLE bid_forms ADD COLUMN final_payment_deadline_hours INTEGER DEFAULT 48';
  END IF;
END $$;

-- 2) offers: minimal new columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='offers' AND column_name='buyer_message'
  ) THEN
    EXECUTE 'ALTER TABLE offers ADD COLUMN buyer_message TEXT';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='offers' AND column_name='deposit_pi_id'
  ) THEN
    EXECUTE 'ALTER TABLE offers ADD COLUMN deposit_pi_id VARCHAR(255)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='offers' AND column_name='deposit_status'
  ) THEN
    EXECUTE 'ALTER TABLE offers ADD COLUMN deposit_status VARCHAR(20) DEFAULT ''pending''';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='offers' AND column_name='final_pi_id'
  ) THEN
    EXECUTE 'ALTER TABLE offers ADD COLUMN final_pi_id VARCHAR(255)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='offers' AND column_name='final_status'
  ) THEN
    EXECUTE 'ALTER TABLE offers ADD COLUMN final_status VARCHAR(20) DEFAULT ''pending''';
  END IF;
END $$;

-- 3) helper: create a placeholder merchant if none exists (for sample form)
-- NOTE: replace 'demo@merchant.test' with your test account email if needed.
INSERT INTO merchants (user_id, email, name, company_name, subscription_plan, subscription_status)
SELECT gen_random_uuid(), 'demo@merchant.test', 'Demo Merchant', 'Demo Co', 'free', 'active'
WHERE NOT EXISTS (SELECT 1 FROM merchants WHERE email='demo@merchant.test');

-- 4) create a sample bid form if not exists
INSERT INTO bid_forms (
  merchant_id, title, description, product_name, base_price, min_bid_ratio, 
  deposit_percentage, currency, quantity_available, theme_color, status,
  allow_optional_message, final_payment_deadline_hours
)
SELECT m.id,
  'Vintage Guitar – Offer Form',
  'Accepting reasonable offers. A small deposit is required to submit an offer.',
  'Vintage Guitar',
  999.00,
  60.00,
  10.00,
  'USD',
  1,
  '#3B82F6',
  'active',
  TRUE,
  48
FROM merchants m
WHERE m.email='demo@merchant.test'
AND NOT EXISTS (
  SELECT 1 FROM bid_forms WHERE title='Vintage Guitar – Offer Form' AND merchant_id=m.id
);