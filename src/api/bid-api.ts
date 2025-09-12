// 投标处理API
// 处理公开的投标提交和表单获取

import { supabase } from '../lib/supabase';
import { BidForm, Offer, CreateOfferData, OfferInsert } from '../types/database';
import { PaymentAPI } from './payment-api';

export class BidAPI {
  
  // 获取公开的投标表单信息 (不需要认证)
  static async getBidForm(formId: string): Promise<BidForm | null> {
    try {
      const { data, error } = await supabase
        .from('bid_forms')
        .select(`
          *,
          merchants!inner(
            name,
            company_name,
            website_url
          )
        `)
        .eq('id', formId)
        .eq('status', 'active')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // 表单不存在
        }
        throw new Error(`获取表单失败: ${error.message}`);
      }

      // 检查表单是否过期
      if (data.bid_end_date && new Date(data.bid_end_date) < new Date()) {
        // 自动更新过期状态
        await supabase
          .from('bid_forms')
          .update({ status: 'ended' })
          .eq('id', formId);
        
        return null;
      }

      return data;
    } catch (error) {
      console.error('获取投标表单失败:', error);
      throw error;
    }
  }

  // 提交投标 (不需要认证)
  static async submitBid(bidData: CreateOfferData): Promise<{
    offer: Offer;
    paymentIntent?: any;
  }> {
    try {
      // 验证表单是否存在且有效
      const form = await this.getBidForm(bidData.bid_form_id);
      if (!form) {
        throw new Error('投标表单不存在或已过期');
      }

      // 验证投标金额
      if (form.min_bid_amount && bidData.bid_amount < form.min_bid_amount) {
        throw new Error(`投标金额不能低于 $${form.min_bid_amount}`);
      }

      if (form.max_bid_amount && bidData.bid_amount > form.max_bid_amount) {
        throw new Error(`投标金额不能高于 $${form.max_bid_amount}`);
      }

      // 验证数量
      if (bidData.quantity && bidData.quantity > form.quantity_available) {
        throw new Error(`投标数量不能超过 ${form.quantity_available}`);
      }

      // 计算预付款和余款
      const depositPercentage = form.deposit_percentage / 100;
      const totalAmount = bidData.bid_amount * (bidData.quantity || 1);
      const depositAmount = Math.round(totalAmount * depositPercentage * 100) / 100;
      const remainingAmount = Math.round((totalAmount - depositAmount) * 100) / 100;

      // 创建投标记录
      const offerData: OfferInsert = {
        bid_form_id: bidData.bid_form_id,
        bidder_name: bidData.bidder_name,
        bidder_email: bidData.bidder_email,
        bidder_phone: bidData.bidder_phone,
        bid_amount: bidData.bid_amount,
        quantity: bidData.quantity || 1,
        message: bidData.message,
        deposit_amount: depositAmount,
        remaining_amount: remainingAmount,
        status: 'pending'
      };

      const { data: offer, error: offerError } = await supabase
        .from('offers')
        .insert(offerData)
        .select()
        .single();

      if (offerError) {
        throw new Error(`创建投标失败: ${offerError.message}`);
      }

      // 检查是否达到自动接受阈值
      if (form.auto_accept_threshold && bidData.bid_amount >= form.auto_accept_threshold) {
        await supabase
          .from('offers')
          .update({
            status: 'accepted',
            accepted_at: new Date().toISOString()
          })
          .eq('id', offer.id);

        offer.status = 'accepted';
        offer.accepted_at = new Date().toISOString();
      }

      // 创建商户通知
      await this.createBidNotification(offer, form);

      // 如果投标被自动接受，创建支付意图
      let paymentIntent;
      if (offer.status === 'accepted') {
        try {
          paymentIntent = await PaymentAPI.createDepositPaymentIntent({
            offer_id: offer.id,
            payment_type: 'deposit'
          });
        } catch (paymentError) {
          console.error('创建支付意图失败:', paymentError);
          // 支付意图创建失败不影响投标创建
        }
      }

      return {
        offer,
        paymentIntent
      };

    } catch (error) {
      console.error('提交投标失败:', error);
      throw error;
    }
  }

  // 获取投标状态 (通过邮箱验证)
  static async getBidStatus(offerId: string, bidderEmail: string): Promise<Offer | null> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          bid_forms!inner(
            title,
            product_name,
            merchants!inner(
              name,
              company_name
            )
          )
        `)
        .eq('id', offerId)
        .eq('bidder_email', bidderEmail)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`获取投标状态失败: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('获取投标状态失败:', error);
      throw error;
    }
  }

  // 获取表单的公开统计信息
  static async getFormStats(formId: string): Promise<{
    totalBids: number;
    highestBid: number;
    averageBid: number;
    timeRemaining?: number;
  }> {
    try {
      const { data: form } = await supabase
        .from('bid_forms')
        .select('total_bids, highest_bid, bid_end_date')
        .eq('id', formId)
        .eq('status', 'active')
        .single();

      if (!form) {
        throw new Error('表单不存在');
      }

      // 获取平均投标金额
      const { data: offers } = await supabase
        .from('offers')
        .select('bid_amount')
        .eq('bid_form_id', formId);

      const averageBid = offers && offers.length > 0
        ? offers.reduce((sum: number, offer: any) => sum + offer.bid_amount, 0) / offers.length
        : 0;

      // 计算剩余时间
      let timeRemaining;
      if (form.bid_end_date) {
        const endTime = new Date(form.bid_end_date).getTime();
        const now = new Date().getTime();
        timeRemaining = Math.max(0, endTime - now);
      }

      return {
        totalBids: form.total_bids,
        highestBid: form.highest_bid,
        averageBid: Math.round(averageBid * 100) / 100,
        timeRemaining
      };
    } catch (error) {
      console.error('获取表单统计失败:', error);
      throw error;
    }
  }

  // 获取表单的最近投标 (匿名化)
  static async getRecentBids(formId: string, limit: number = 5): Promise<Array<{
    bidAmount: number;
    bidderName: string; // 匿名化处理
    createdAt: string;
  }>> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('bid_amount, bidder_name, created_at')
        .eq('bid_form_id', formId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`获取最近投标失败: ${error.message}`);
      }

      // 匿名化处理
      return (data || []).map((bid: any) => ({
        bidAmount: bid.bid_amount,
        bidderName: this.anonymizeName(bid.bidder_name),
        createdAt: bid.created_at
      }));
    } catch (error) {
      console.error('获取最近投标失败:', error);
      throw error;
    }
  }

  // 验证投标邮箱并发送状态链接
  static async sendBidStatusLink(offerId: string, bidderEmail: string): Promise<void> {
    try {
      const offer = await this.getBidStatus(offerId, bidderEmail);
      if (!offer) {
        throw new Error('投标不存在或邮箱不匹配');
      }

      // 这里应该集成邮件服务发送状态链接
      // 暂时只是验证功能
      console.log(`发送投标状态链接到: ${bidderEmail}`);
      console.log(`投标ID: ${offerId}`);
      console.log(`状态链接: ${window.location.origin}/bid-status/${offerId}?email=${encodeURIComponent(bidderEmail)}`);

    } catch (error) {
      console.error('发送投标状态链接失败:', error);
      throw error;
    }
  }

  // 取消投标 (仅在特定条件下允许)
  static async cancelBid(offerId: string, bidderEmail: string): Promise<void> {
    try {
      const offer = await this.getBidStatus(offerId, bidderEmail);
      if (!offer) {
        throw new Error('投标不存在或邮箱不匹配');
      }

      // 只有待处理状态的投标可以取消
      if (offer.status !== 'pending') {
        throw new Error('只有待处理状态的投标可以取消');
      }

      // 检查是否已支付预付款
      if (offer.deposit_payment_status === 'paid') {
        throw new Error('已支付预付款的投标无法取消，请联系商户');
      }

      await supabase
        .from('offers')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId);

    } catch (error) {
      console.error('取消投标失败:', error);
      throw error;
    }
  }

  // 私有方法：创建投标通知
  private static async createBidNotification(offer: Offer, form: BidForm): Promise<void> {
    try {
      const title = offer.status === 'accepted' ? '新投标已自动接受' : '收到新投标';
      const message = `${offer.bidder_name} 对 "${form.product_name}" 出价 $${offer.bid_amount}${offer.status === 'accepted' ? '，已自动接受' : ''}`;

      await supabase
        .from('notifications')
        .insert({
          merchant_id: form.merchant_id,
          type: 'new_bid',
          title,
          message,
          related_offer_id: offer.id
        });
    } catch (error) {
      console.error('创建投标通知失败:', error);
    }
  }

  // 私有方法：匿名化姓名
  private static anonymizeName(name: string): string {
    if (!name || name.length <= 2) {
      return name;
    }

    const firstChar = name.charAt(0);
    const lastChar = name.charAt(name.length - 1);
    const middleStars = '*'.repeat(Math.max(1, name.length - 2));

    return `${firstChar}${middleStars}${lastChar}`;
  }

  // 获取表单的投标排行榜 (匿名化)
  static async getBidLeaderboard(formId: string, limit: number = 10): Promise<Array<{
    rank: number;
    bidAmount: number;
    bidderName: string;
    createdAt: string;
  }>> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('bid_amount, bidder_name, created_at')
        .eq('bid_form_id', formId)
        .order('bid_amount', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`获取投标排行榜失败: ${error.message}`);
      }

      return (data || []).map((bid, index) => ({
        rank: index + 1,
        bidAmount: bid.bid_amount,
        bidderName: this.anonymizeName(bid.bidder_name),
        createdAt: bid.created_at
      }));
    } catch (error) {
      console.error('获取投标排行榜失败:', error);
      throw error;
    }
  }

  // 检查邮箱是否已投标
  static async checkEmailExists(formId: string, email: string): Promise<boolean> {
    try {
      const { count } = await supabase
        .from('offers')
        .select('*', { count: 'exact', head: true })
        .eq('bid_form_id', formId)
        .eq('bidder_email', email);

      return (count || 0) > 0;
    } catch (error) {
      console.error('检查邮箱失败:', error);
      return false;
    }
  }

  // 获取表单配置 (用于Widget)
  static async getWidgetConfig(formId: string): Promise<{
    theme_color: string;
    custom_css?: string;
    currency: string;
    deposit_percentage: number;
    min_bid_amount?: number;
    max_bid_amount?: number;
  } | null> {
    try {
      const { data, error } = await supabase
        .from('bid_forms')
        .select('theme_color, custom_css, currency, deposit_percentage, min_bid_amount, max_bid_amount')
        .eq('id', formId)
        .eq('status', 'active')
        .single();

      if (error) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('获取Widget配置失败:', error);
      return null;
    }
  }
}