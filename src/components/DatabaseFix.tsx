import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const DatabaseFix: React.FC = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const fixScript = `
-- 快速修复脚本 - 创建缺失的函数和字段
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
`;

  const createFunctionScript = `
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
    p_title,
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
`;

  const createViewScript = `
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
`;

  const updatePoliciesScript = `
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
`;

  const executeScript = async (script: string, description: string) => {
    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql: script });
      if (error) {
        throw error;
      }
      return `✅ ${description} - 执行成功\n`;
    } catch (err: any) {
      throw new Error(`❌ ${description} - 执行失败: ${err.message}\n`);
    }
  };

  const executeFix = async () => {
    setIsExecuting(true);
    setResult('');
    setError('');
    
    try {
      let output = '开始执行数据库修复...\n\n';
      
      // 步骤1: 添加字段
      try {
        output += await executeScript(fixScript, '添加缺失字段');
      } catch (err: any) {
        output += err.message;
      }
      
      // 步骤2: 创建函数
      try {
        output += await executeScript(createFunctionScript, '创建 create_bid_form_api 函数');
      } catch (err: any) {
        output += err.message;
      }
      
      // 步骤3: 创建视图
      try {
        output += await executeScript(createViewScript, '创建兼容视图');
      } catch (err: any) {
        output += err.message;
      }
      
      // 步骤4: 更新策略
      try {
        output += await executeScript(updatePoliciesScript, '更新 RLS 策略');
      } catch (err: any) {
        output += err.message;
      }
      
      output += '\n🎉 数据库修复完成！请刷新页面并重试创建产品。';
      setResult(output);
      
    } catch (err: any) {
      setError(`修复过程中发生错误: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">数据库修复工具</h2>
      
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">⚠️ 注意事项</h3>
        <p className="text-yellow-700">
          此工具将修复数据库中缺失的字段和函数，解决"Could not find the function public.create_bid_form_api"错误。
          执行前请确保你有数据库管理权限。
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">修复内容：</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>添加 starting_price, minimum_bid_ratio, allow_messages, user_id 字段</li>
          <li>创建 create_bid_form_api 函数</li>
          <li>创建 bid_forms_api 兼容视图</li>
          <li>更新行级安全策略 (RLS)</li>
        </ul>
      </div>

      <button
        onClick={executeFix}
        disabled={isExecuting}
        className={`px-6 py-3 rounded-lg font-semibold text-white ${
          isExecuting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isExecuting ? '正在执行修复...' : '执行数据库修复'}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">执行结果：</h3>
          <pre className="text-sm text-green-700 whitespace-pre-wrap">{result}</pre>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">错误信息：</h3>
          <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-800 text-sm">
              <strong>手动修复方法：</strong><br/>
              1. 访问 <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">Supabase 控制台</a><br/>
              2. 选择你的项目<br/>
              3. 点击 "SQL Editor"<br/>
              4. 复制 database/quick_fix.sql 文件内容并执行
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseFix;