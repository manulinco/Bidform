// 支付处理API
// 处理Stripe支付集成和分期付款逻辑

import { supabase } from '../lib/supabase';
import { stripe } from '../lib/stripe-server';
import { Offer, Payment, PaymentInsert, CreatePaymentIntentData, StripePaymentIntent } from '../types/database';

export class PaymentAPI {
  
  // 创建支付意图 (预付款)
  static async createDepositPaymentIntent(data: CreatePaymentIntentData): Promise<StripePaymentIntent> {
    try {
      // 获取投标信息
      const { data: offer, error: offerError } = await supabase
        .from('offers')
        .select(`
          *,
          bid_forms!inner(
            merchant_id,
            deposit_percentage,
            currency,
            merchants!inner(
              stripe_account_id,
              subscription_plan
            )
          )
        `)
        .eq('id', data.offer_id)
        .single();

      if (offerError || !offer) {
        throw new Error('投标不存在');
      }

      const merchant = offer.bid_forms.merchants;
      const depositAmount = offer.deposit_amount;
      
      // 计算手续费
      const fees = this.calculateFees(depositAmount, merchant.subscription_plan);
      
      // 创建Stripe PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(depositAmount * 100), // 转换为分
        currency: offer.bid_forms.currency.toLowerCase(),
        metadata: {
          offer_id: data.offer_id,
          payment_type: 'deposit',
          merchant_id: offer.bid_forms.merchant_id,
          platform_fee: fees.platformFee.toString(),
          stripe_fee: fees.stripeFee.toString()
        },
        application_fee_amount: Math.round(fees.totalFee * 100),
        transfer_data: merchant.stripe_account_id ? {
          destination: merchant.stripe_account_id,
        } : undefined,
        automatic_payment_methods: {
          enabled: true,
        },
        return_url: data.return_url || `${window.location.origin}/payment/success`
      });

      // 保存支付记录
      await this.createPaymentRecord({
        offer_id: data.offer_id,
        merchant_id: offer.bid_forms.merchant_id,
        stripe_payment_intent_id: paymentIntent.id,
        amount: depositAmount,
        currency: offer.bid_forms.currency,
        payment_type: 'deposit',
        stripe_fee: fees.stripeFee,
        platform_fee: fees.platformFee,
        merchant_amount: depositAmount - fees.totalFee
      });

      // 更新投标记录
      await supabase
        .from('offers')
        .update({
          payment_intent_id: paymentIntent.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.offer_id);

      return {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret!,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status
      };

    } catch (error) {
      console.error('创建支付意图失败:', error);
      throw new Error(`创建支付意图失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  // 创建余款支付意图
  static async createFinalPaymentIntent(offerId: string): Promise<StripePaymentIntent> {
    try {
      // 获取投标信息
      const { data: offer, error: offerError } = await supabase
        .from('offers')
        .select(`
          *,
          bid_forms!inner(
            merchant_id,
            currency,
            merchants!inner(
              stripe_account_id,
              subscription_plan
            )
          )
        `)
        .eq('id', offerId)
        .eq('status', 'accepted')
        .eq('deposit_payment_status', 'paid')
        .single();

      if (offerError || !offer) {
        throw new Error('投标不存在或状态不正确');
      }

      const merchant = offer.bid_forms.merchants;
      const finalAmount = offer.remaining_amount;
      
      // 计算手续费
      const fees = this.calculateFees(finalAmount, merchant.subscription_plan);
      
      // 创建Stripe PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(finalAmount * 100),
        currency: offer.bid_forms.currency.toLowerCase(),
        metadata: {
          offer_id: offerId,
          payment_type: 'final',
          merchant_id: offer.bid_forms.merchant_id,
          platform_fee: fees.platformFee.toString(),
          stripe_fee: fees.stripeFee.toString()
        },
        application_fee_amount: Math.round(fees.totalFee * 100),
        transfer_data: merchant.stripe_account_id ? {
          destination: merchant.stripe_account_id,
        } : undefined,
        automatic_payment_methods: {
          enabled: true,
        }
      });

      // 保存支付记录
      await this.createPaymentRecord({
        offer_id: offerId,
        merchant_id: offer.bid_forms.merchant_id,
        stripe_payment_intent_id: paymentIntent.id,
        amount: finalAmount,
        currency: offer.bid_forms.currency,
        payment_type: 'final',
        stripe_fee: fees.stripeFee,
        platform_fee: fees.platformFee,
        merchant_amount: finalAmount - fees.totalFee
      });

      return {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret!,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status
      };

    } catch (error) {
      console.error('创建余款支付意图失败:', error);
      throw new Error(`创建余款支付意图失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  // 处理支付成功回调
  static async handlePaymentSuccess(paymentIntentId: string): Promise<void> {
    try {
      // 获取支付意图信息
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        throw new Error('支付未成功');
      }

      const offerId = paymentIntent.metadata.offer_id;
      const paymentType = paymentIntent.metadata.payment_type as 'deposit' | 'final';

      // 更新支付记录
      await supabase
        .from('payments')
        .update({
          status: 'succeeded',
          processed_at: new Date().toISOString()
        })
        .eq('stripe_payment_intent_id', paymentIntentId);

      // 更新投标状态
      if (paymentType === 'deposit') {
        await supabase
          .from('offers')
          .update({
            deposit_payment_status: 'paid',
            updated_at: new Date().toISOString()
          })
          .eq('id', offerId);

        // 创建通知
        await this.createPaymentNotification(offerId, 'deposit_paid');

      } else if (paymentType === 'final') {
        await supabase
          .from('offers')
          .update({
            final_payment_status: 'paid',
            status: 'completed',
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', offerId);

        // 创建通知
        await this.createPaymentNotification(offerId, 'final_paid');
      }

    } catch (error) {
      console.error('处理支付成功回调失败:', error);
      throw error;
    }
  }

  // 处理支付失败回调
  static async handlePaymentFailure(paymentIntentId: string): Promise<void> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      const offerId = paymentIntent.metadata.offer_id;
      const paymentType = paymentIntent.metadata.payment_type as 'deposit' | 'final';

      // 更新支付记录
      await supabase
        .from('payments')
        .update({
          status: 'failed',
          processed_at: new Date().toISOString()
        })
        .eq('stripe_payment_intent_id', paymentIntentId);

      // 更新投标状态
      if (paymentType === 'deposit') {
        await supabase
          .from('offers')
          .update({
            deposit_payment_status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', offerId);
      } else if (paymentType === 'final') {
        await supabase
          .from('offers')
          .update({
            final_payment_status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', offerId);
      }

      // 创建通知
      await this.createPaymentNotification(offerId, 'payment_failed');

    } catch (error) {
      console.error('处理支付失败回调失败:', error);
      throw error;
    }
  }

  // 获取支付记录
  static async getPaymentHistory(merchantId: string, limit: number = 50): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        offers!inner(
          bidder_name,
          bidder_email,
          bid_amount,
          bid_forms!inner(
            title,
            product_name
          )
        )
      `)
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`获取支付记录失败: ${error.message}`);
    }

    return data || [];
  }

  // 获取支付统计
  static async getPaymentStats(merchantId: string): Promise<{
    totalRevenue: number;
    pendingAmount: number;
    successfulPayments: number;
    failedPayments: number;
    averageTransactionAmount: number;
  }> {
    const { data, error } = await supabase
      .from('payments')
      .select('amount, status')
      .eq('merchant_id', merchantId);

    if (error) {
      throw new Error(`获取支付统计失败: ${error.message}`);
    }

    const payments = data || [];
    
    const totalRevenue = payments
      .filter((p: any) => p.status === 'succeeded')
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    const pendingAmount = payments
      .filter((p: any) => p.status === 'pending')
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    const successfulPayments = payments.filter((p: any) => p.status === 'succeeded').length;
    const failedPayments = payments.filter((p: any) => p.status === 'failed').length;
    
    const averageTransactionAmount = successfulPayments > 0 
      ? totalRevenue / successfulPayments 
      : 0;

    return {
      totalRevenue,
      pendingAmount,
      successfulPayments,
      failedPayments,
      averageTransactionAmount
    };
  }

  // 退款处理
  static async processRefund(paymentIntentId: string, amount?: number): Promise<void> {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined
      });

      // 更新支付记录
      await supabase
        .from('payments')
        .update({
          status: 'cancelled',
          processed_at: new Date().toISOString()
        })
        .eq('stripe_payment_intent_id', paymentIntentId);

      // 获取相关投标信息并更新状态
      const { data: payment } = await supabase
        .from('payments')
        .select('offer_id, payment_type')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .single();

      if (payment) {
        if (payment.payment_type === 'deposit') {
          await supabase
            .from('offers')
            .update({
              deposit_payment_status: 'failed',
              status: 'cancelled',
              updated_at: new Date().toISOString()
            })
            .eq('id', payment.offer_id);
        }
      }

    } catch (error) {
      console.error('退款处理失败:', error);
      throw new Error(`退款处理失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  // 私有方法：计算手续费
  private static calculateFees(amount: number, plan: string): {
    stripeFee: number;
    platformFee: number;
    totalFee: number;
  } {
    // Stripe手续费: 2.9% + $0.30
    const stripeFee = Math.round((amount * 0.029 + 0.30) * 100) / 100;
    
    // 平台手续费
    let platformFeeRate = 0;
    switch (plan) {
      case 'free':
        platformFeeRate = 0.05; // 5%
        break;
      case 'basic':
      case 'pro':
        platformFeeRate = 0; // 付费计划无平台手续费
        break;
    }
    
    const platformFee = Math.round(amount * platformFeeRate * 100) / 100;
    const totalFee = stripeFee + platformFee;

    return {
      stripeFee,
      platformFee,
      totalFee
    };
  }

  // 私有方法：创建支付记录
  private static async createPaymentRecord(data: PaymentInsert): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .insert(data);

    if (error) {
      throw new Error(`创建支付记录失败: ${error.message}`);
    }
  }

  // 私有方法：创建支付通知
  private static async createPaymentNotification(offerId: string, type: string): Promise<void> {
    try {
      // 获取投标和商户信息
      const { data: offer } = await supabase
        .from('offers')
        .select(`
          *,
          bid_forms!inner(
            merchant_id,
            title,
            product_name
          )
        `)
        .eq('id', offerId)
        .single();

      if (!offer) return;

      let title = '';
      let message = '';

      switch (type) {
        case 'deposit_paid':
          title = '收到预付款';
          message = `${offer.bidder_name} 已支付预付款 $${offer.deposit_amount}，投标产品: ${offer.bid_forms.product_name}`;
          break;
        case 'final_paid':
          title = '收到余款';
          message = `${offer.bidder_name} 已支付余款 $${offer.remaining_amount}，交易完成`;
          break;
        case 'payment_failed':
          title = '支付失败';
          message = `${offer.bidder_name} 的支付失败，请联系客户重新支付`;
          break;
      }

      await supabase
        .from('notifications')
        .insert({
          merchant_id: offer.bid_forms.merchant_id,
          type,
          title,
          message,
          related_offer_id: offerId
        });

    } catch (error) {
      console.error('创建支付通知失败:', error);
    }
  }

  // 验证支付状态
  static async verifyPaymentStatus(paymentIntentId: string): Promise<{
    status: string;
    amount: number;
    currency: string;
  }> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase()
      };
    } catch (error) {
      console.error('验证支付状态失败:', error);
      throw new Error('验证支付状态失败');
    }
  }

  // 获取Stripe仪表板链接
  static async getStripeDashboardLink(merchantId: string): Promise<string> {
    try {
      const { data: merchant } = await supabase
        .from('merchants')
        .select('stripe_account_id')
        .eq('id', merchantId)
        .single();

      if (!merchant?.stripe_account_id) {
        throw new Error('Stripe账户未连接');
      }

      const link = await stripe.accounts.createLoginLink(merchant.stripe_account_id);
      return link.url;
    } catch (error) {
      console.error('获取Stripe仪表板链接失败:', error);
      throw new Error('获取Stripe仪表板链接失败');
    }
  }
}