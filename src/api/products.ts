import { supabase } from '../lib/supabase'
import { BidForm, CreateBidFormData, normalizeBidForm } from '../types'
import { 
  saveProductToStorage, 
  getStoredProducts, 
  getStoredProduct, 
  updateStoredProduct, 
  deleteStoredProduct 
} from './fallbackStorage'

export async function createBidForm(formData: CreateBidFormData): Promise<BidForm> {
  try {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User must be logged in to create products');
    }

    // 首先尝试使用数据库函数创建产品
    try {
      const { data, error } = await supabase.rpc('create_bid_form_api', {
        p_title: formData.title,
        p_description: formData.description || null,
        p_starting_price: formData.starting_price,
        p_currency: formData.currency || 'USD',
        p_deposit_percentage: formData.deposit_percentage || 10,
        p_minimum_bid_ratio: formData.minimum_bid_ratio || 70,
        p_theme_color: formData.theme_color || '#ee5e3a',
        p_allow_messages: formData.allow_messages !== false,
        p_user_id: user.id
      });

      if (!error && data) {
        return normalizeBidForm(data[0]);
      }
    } catch (funcError) {
      console.log('数据库函数不存在，使用直接插入方式');
    }

    // 如果函数不存在，使用直接插入方式
    // 尝试获取或创建商户记录，如果 merchants 表不存在则跳过
    let merchantId = null;
    
    try {
      let { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (merchantError || !merchant) {
        // 创建新的商户记录
        const { data: newMerchant, error: createMerchantError } = await supabase
          .from('merchants')
          .insert({
            user_id: user.id,
            email: user.email || 'user@example.com',
            name: user.user_metadata?.name || 'User',
            subscription_plan: 'free',
            subscription_status: 'active'
          })
          .select('id')
          .single();

        if (createMerchantError) {
          console.log('Merchants table not available, proceeding without merchant_id');
        } else {
          merchantId = newMerchant.id;
        }
      } else {
        merchantId = merchant.id;
      }
    } catch (error) {
      console.log('Merchants table not available, proceeding without merchant_id');
    }

    // 创建 bid_form 记录（兼容有无 merchants 表的情况）
    const bidFormData: any = {
      title: formData.title,
      description: formData.description || null,
      product_name: formData.title,
      base_price: formData.starting_price,
      starting_price: formData.starting_price,
      currency: formData.currency || 'USD',
      deposit_percentage: formData.deposit_percentage || 10,
      minimum_bid_ratio: formData.minimum_bid_ratio || 70,
      min_bid_ratio: formData.minimum_bid_ratio || 70,
      theme_color: formData.theme_color || '#ee5e3a',
      allow_messages: formData.allow_messages !== false,
      allow_optional_message: formData.allow_messages !== false,
      status: 'active',
      user_id: user.id
    };

    // 只有在有 merchantId 时才添加 merchant_id 字段
    if (merchantId) {
      bidFormData.merchant_id = merchantId;
    }

    const { data: bidForm, error: bidFormError } = await supabase
      .from('bid_forms')
      .insert(bidFormData)
      .select()
      .single();

    if (bidFormError) {
      console.error('Database insert failed, using local storage fallback:', bidFormError);
      // 回退到本地存储
      return saveProductToStorage(formData);
    }

    return normalizeBidForm(bidForm);
  } catch (error) {
    console.error('Database error, using local storage fallback:', error);
    // 如果数据库完全不可用，使用本地存储
    return saveProductToStorage(formData);
  }
}

export async function getBidForms(): Promise<BidForm[]> {
  try {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('User not authenticated, using local storage');
      return getStoredProducts();
    }

    // 使用视图获取用户的产品列表，支持兼容字段
    const { data, error } = await supabase
      .from('bid_forms_api')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to get products from view, trying direct table access:', error);
      // 如果视图不存在，尝试直接查询表
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('bid_forms')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fallbackError) {
        console.error('Database access failed, using local storage:', fallbackError);
        return getStoredProducts();
      }
      
      return (fallbackData || []).map(normalizeBidForm);
    }

    return (data || []).map(normalizeBidForm);
  } catch (error) {
    console.error('Error getting products, using local storage fallback:', error);
    return getStoredProducts();
  }
}

export async function getBidForm(id: string): Promise<BidForm | null> {
  try {
    const { data, error } = await supabase
      .from('bid_forms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 记录不存在，尝试从本地存储获取
        return getStoredProduct(id);
      }
      console.error('Database access failed, trying local storage:', error);
      return getStoredProduct(id);
    }

    return data;
  } catch (error) {
    console.error('Error getting product, trying local storage:', error);
    return getStoredProduct(id);
  }
}

export async function updateBidForm(id: string, updates: Partial<CreateBidFormData>): Promise<BidForm> {
  try {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('用户必须登录才能更新产品');
    }

    // 更新产品
    const { data, error } = await supabase
      .from('bid_forms')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id) // 确保只能更新自己的产品
      .select()
      .single();

    if (error) {
      console.error('更新产品失败:', error);
      throw new Error(`更新产品失败: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('更新产品时发生错误:', error);
    throw error;
  }
}

export async function deleteBidForm(id: string): Promise<void> {
  try {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('用户必须登录才能删除产品');
    }

    // 删除产品
    const { error } = await supabase
      .from('bid_forms')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // 确保只能删除自己的产品

    if (error) {
      console.error('删除产品失败:', error);
      throw new Error(`删除产品失败: ${error.message}`);
    }
  } catch (error) {
    console.error('删除产品时发生错误:', error);
    throw error;
  }
}

export async function updateBidFormStatus(id: string, status: BidForm['status']): Promise<void> {
  try {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('用户必须登录才能更新产品状态');
    }

    // 更新产品状态
    const { error } = await supabase
      .from('bid_forms')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id); // 确保只能更新自己的产品

    if (error) {
      console.error('更新产品状态失败:', error);
      throw new Error(`更新产品状态失败: ${error.message}`);
    }
  } catch (error) {
    console.error('更新产品状态时发生错误:', error);
    throw error;
  }
}