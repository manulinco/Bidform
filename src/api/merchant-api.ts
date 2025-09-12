// 商户API服务
// 处理商户相关的所有后端操作

import { supabase } from '../lib/supabase';
import { Merchant, BidForm, Offer } from '../types/database';

export class MerchantAPI {
  
  // 创建或更新商户信息
  static async upsertMerchant(merchantData: {
    email: string;
    name: string;
    company_name?: string;
    website_url?: string;
  }): Promise<Merchant> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('用户未登录');
    }

    const { data, error } = await supabase
      .from('merchants')
      .upsert({
        user_id: user.id,
        email: merchantData.email,
        name: merchantData.name,
        company_name: merchantData.company_name,
        website_url: merchantData.website_url,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`创建商户失败: ${error.message}`);
    }

    return data;
  }

  // 获取当前商户信息
  static async getCurrentMerchant(): Promise<Merchant | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('merchants')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`获取商户信息失败: ${error.message}`);
    }

    return data;
  }

  // 创建投标表单
  static async createBidForm(formData: {
    title: string;
    description?: string;
    product_name: string;
    base_price: number;
    min_bid_amount?: number;
    max_bid_amount?: number;
    currency?: string;
    quantity_available?: number;
    bid_end_date?: string;
    auto_accept_threshold?: number;
    deposit_percentage?: number;
    theme_color?: string;
    custom_css?: string;
  }): Promise<BidForm> {
    const merchant = await this.getCurrentMerchant();
    
    if (!merchant) {
      throw new Error('商户信息不存在');
    }

    // 检查表单数量限制
    const { count } = await supabase
      .from('bid_forms')
      .select('*', { count: 'exact', head: true })
      .eq('merchant_id', merchant.id)
      .eq('status', 'active');

    const maxForms = this.getMaxFormsForPlan(merchant.subscription_plan);
    
    if (count && count >= maxForms) {
      throw new Error(`${merchant.subscription_plan}计划最多只能创建${maxForms}个表单`);
    }

    const { data, error } = await supabase
      .from('bid_forms')
      .insert({
        merchant_id: merchant.id,
        title: formData.title,
        description: formData.description,
        product_name: formData.product_name,
        base_price: formData.base_price,
        min_bid_amount: formData.min_bid_amount,
        max_bid_amount: formData.max_bid_amount,
        currency: formData.currency || 'USD',
        quantity_available: formData.quantity_available || 1,
        bid_end_date: formData.bid_end_date,
        auto_accept_threshold: formData.auto_accept_threshold,
        deposit_percentage: formData.deposit_percentage || 10,
        theme_color: formData.theme_color || '#3B82F6',
        custom_css: formData.custom_css
      })
      .select()
      .single();

    if (error) {
      throw new Error(`创建表单失败: ${error.message}`);
    }

    return data;
  }

  // 获取商户的所有表单
  static async getBidForms(): Promise<BidForm[]> {
    const merchant = await this.getCurrentMerchant();
    
    if (!merchant) {
      throw new Error('商户信息不存在');
    }

    const { data, error } = await supabase
      .from('bid_forms')
      .select('*')
      .eq('merchant_id', merchant.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`获取表单列表失败: ${error.message}`);
    }

    return data || [];
  }

  // 更新表单状态
  static async updateBidFormStatus(formId: string, status: 'active' | 'paused' | 'ended'): Promise<void> {
    const merchant = await this.getCurrentMerchant();
    
    if (!merchant) {
      throw new Error('商户信息不存在');
    }

    const { error } = await supabase
      .from('bid_forms')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', formId)
      .eq('merchant_id', merchant.id);

    if (error) {
      throw new Error(`更新表单状态失败: ${error.message}`);
    }
  }

  // 获取表单的投标记录
  static async getFormOffers(formId: string): Promise<Offer[]> {
    const merchant = await this.getCurrentMerchant();
    
    if (!merchant) {
      throw new Error('商户信息不存在');
    }

    // 验证表单属于当前商户
    const { data: form } = await supabase
      .from('bid_forms')
      .select('id')
      .eq('id', formId)
      .eq('merchant_id', merchant.id)
      .single();

    if (!form) {
      throw new Error('表单不存在或无权限访问');
    }

    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('bid_form_id', formId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`获取投标记录失败: ${error.message}`);
    }

    return data || [];
  }

  // 接受投标
  static async acceptOffer(offerId: string): Promise<void> {
    const merchant = await this.getCurrentMerchant();
    
    if (!merchant) {
      throw new Error('商户信息不存在');
    }

    // 验证投标属于当前商户的表单
    const { data: offer } = await supabase
      .from('offers')
      .select(`
        *,
        bid_forms!inner(merchant_id)
      `)
      .eq('id', offerId)
      .eq('bid_forms.merchant_id', merchant.id)
      .single();

    if (!offer) {
      throw new Error('投标不存在或无权限访问');
    }

    const { error } = await supabase
      .from('offers')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', offerId);

    if (error) {
      throw new Error(`接受投标失败: ${error.message}`);
    }

    // 创建通知
    await this.createNotification(merchant.id, {
      type: 'bid_accepted',
      title: '投标已接受',
      message: `您已接受来自 ${offer.bidder_name} 的投标，金额: $${offer.bid_amount}`,
      related_offer_id: offerId
    });
  }

  // 拒绝投标
  static async rejectOffer(offerId: string): Promise<void> {
    const merchant = await this.getCurrentMerchant();
    
    if (!merchant) {
      throw new Error('商户信息不存在');
    }

    // 验证投标属于当前商户的表单
    const { data: offer } = await supabase
      .from('offers')
      .select(`
        *,
        bid_forms!inner(merchant_id)
      `)
      .eq('id', offerId)
      .eq('bid_forms.merchant_id', merchant.id)
      .single();

    if (!offer) {
      throw new Error('投标不存在或无权限访问');
    }

    const { error } = await supabase
      .from('offers')
      .update({
        status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', offerId);

    if (error) {
      throw new Error(`拒绝投标失败: ${error.message}`);
    }
  }

  // 获取仪表板统计数据
  static async getDashboardStats(): Promise<{
    totalForms: number;
    activeForms: number;
    totalOffers: number;
    acceptedOffers: number;
    totalRevenue: number;
    pendingPayments: number;
  }> {
    const merchant = await this.getCurrentMerchant();
    
    if (!merchant) {
      throw new Error('商户信息不存在');
    }

    const { data, error } = await supabase
      .from('merchant_dashboard_stats')
      .select('*')
      .eq('merchant_id', merchant.id)
      .single();

    if (error) {
      throw new Error(`获取统计数据失败: ${error.message}`);
    }

    // 获取待处理支付数量
    const { count: pendingPayments } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('merchant_id', merchant.id)
      .eq('status', 'pending');

    return {
      totalForms: data?.total_forms || 0,
      activeForms: data?.active_forms || 0,
      totalOffers: data?.total_offers || 0,
      acceptedOffers: data?.accepted_offers || 0,
      totalRevenue: data?.total_revenue || 0,
      pendingPayments: pendingPayments || 0
    };
  }

  // 获取通知
  static async getNotifications(limit: number = 20): Promise<any[]> {
    const merchant = await this.getCurrentMerchant();
    
    if (!merchant) {
      throw new Error('商户信息不存在');
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('merchant_id', merchant.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`获取通知失败: ${error.message}`);
    }

    return data || [];
  }

  // 标记通知为已读
  static async markNotificationAsRead(notificationId: string): Promise<void> {
    const merchant = await this.getCurrentMerchant();
    
    if (!merchant) {
      throw new Error('商户信息不存在');
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('merchant_id', merchant.id);

    if (error) {
      throw new Error(`标记通知失败: ${error.message}`);
    }
  }

  // 创建通知
  private static async createNotification(merchantId: string, notification: {
    type: string;
    title: string;
    message: string;
    related_offer_id?: string;
  }): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .insert({
        merchant_id: merchantId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        related_offer_id: notification.related_offer_id
      });

    if (error) {
      console.error('创建通知失败:', error);
    }
  }

  // 获取计划的最大表单数
  private static getMaxFormsForPlan(plan: string): number {
    switch (plan) {
      case 'free': return 5;
      case 'basic': return 50;
      case 'pro': return 1000;
      default: return 5;
    }
  }

  // 删除表单
  static async deleteBidForm(formId: string): Promise<void> {
    const merchant = await this.getCurrentMerchant();
    
    if (!merchant) {
      throw new Error('商户信息不存在');
    }

    // 检查是否有未完成的投标
    const { count } = await supabase
      .from('offers')
      .select('*', { count: 'exact', head: true })
      .eq('bid_form_id', formId)
      .in('status', ['pending', 'accepted']);

    if (count && count > 0) {
      throw new Error('该表单还有未完成的投标，无法删除');
    }

    const { error } = await supabase
      .from('bid_forms')
      .delete()
      .eq('id', formId)
      .eq('merchant_id', merchant.id);

    if (error) {
      throw new Error(`删除表单失败: ${error.message}`);
    }
  }

  // 更新表单
  static async updateBidForm(formId: string, updates: Partial<BidForm>): Promise<BidForm> {
    const merchant = await this.getCurrentMerchant();
    
    if (!merchant) {
      throw new Error('商户信息不存在');
    }

    const { data, error } = await supabase
      .from('bid_forms')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', formId)
      .eq('merchant_id', merchant.id)
      .select()
      .single();

    if (error) {
      throw new Error(`更新表单失败: ${error.message}`);
    }

    return data;
  }
}