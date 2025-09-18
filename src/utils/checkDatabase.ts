import { supabase } from '../lib/supabase';

export async function checkDatabaseStructure() {
  try {
    console.log('Checking database structure...');
    
    // 检查 bid_forms 表结构
    const { data: bidFormsData, error: bidFormsError } = await supabase
      .from('bid_forms')
      .select('*')
      .limit(1);
    
    if (bidFormsError) {
      console.error('bid_forms table error:', bidFormsError);
    } else {
      console.log('bid_forms table exists, sample data:', bidFormsData);
    }

    // 检查 merchants 表
    const { data: merchantsData, error: merchantsError } = await supabase
      .from('merchants')
      .select('*')
      .limit(1);
    
    if (merchantsError) {
      console.error('merchants table error:', merchantsError);
    } else {
      console.log('merchants table exists, sample data:', merchantsData);
    }

    // 检查 bids 表
    const { data: bidsData, error: bidsError } = await supabase
      .from('bids')
      .select('*')
      .limit(1);
    
    if (bidsError) {
      console.error('bids table error:', bidsError);
    } else {
      console.log('bids table exists, sample data:', bidsData);
    }

    return {
      bidForms: !bidFormsError,
      merchants: !merchantsError,
      bids: !bidsError
    };
  } catch (error) {
    console.error('Database check failed:', error);
    return {
      bidForms: false,
      merchants: false,
      bids: false
    };
  }
}

// 在开发环境中自动检查
if (import.meta.env.DEV) {
  checkDatabaseStructure();
}