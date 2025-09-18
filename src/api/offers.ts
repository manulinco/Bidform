// 出价相关API
import { supabase } from '../lib/supabase'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo')

export interface CreateOfferRequest {
  form_id: string
  bid_amount: number
  buyer_name: string
  buyer_email: string
  buyer_message?: string
  agree_terms: boolean
}

export interface CreateOfferResponse {
  success: boolean
  data?: {
    client_secret: string
    deposit_amount: number
    currency: string
    offer_id: string
  }
  error?: {
    code: string
    message: string
  }
}

// 1. 创建定金意图与出价
export async function createDepositIntent(request: CreateOfferRequest): Promise<CreateOfferResponse> {
  try {
    // 验证表单存在且活跃
    const { data: form, error: formError } = await supabase
      .from('bid_forms')
      .select('*')
      .eq('id', request.form_id)
      .eq('is_active', true)
      .single()

    if (formError || !form) {
      return {
        success: false,
        error: {
          code: 'FORM_NOT_FOUND',
          message: 'Bid form not found or inactive'
        }
      }
    }

    // 验证最低出价金额 (假设最低70%的基础价格)
    const minBidAmount = form.price * 0.7
    if (request.bid_amount < minBidAmount) {
      return {
        success: false,
        error: {
          code: 'BID_TOO_LOW',
          message: `Minimum bid amount is ${form.currency} ${minBidAmount.toFixed(2)}`
        }
      }
    }

    // 验证同意条款
    if (!request.agree_terms) {
      return {
        success: false,
        error: {
          code: 'TERMS_NOT_ACCEPTED',
          message: 'You must agree to the terms and conditions'
        }
      }
    }

    // 计算定金金额 (10%)
    const depositAmount = Math.ceil(request.bid_amount * 0.1)
    const remainingAmount = request.bid_amount - depositAmount

    // 创建出价记录
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .insert({
        form_id: request.form_id,
        buyer_email: request.buyer_email,
        buyer_name: request.buyer_name,
        offer_amount: request.bid_amount,
        message: request.buyer_message || null,
        status: 'pending',
        prepayment_status: 'pending',
        balance_payment_status: 'pending'
      })
      .select()
      .single()

    if (offerError || !offer) {
      return {
        success: false,
        error: {
          code: 'OFFER_CREATION_FAILED',
          message: 'Failed to create offer'
        }
      }
    }

    // 创建 Stripe PaymentIntent (模拟)
    const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36).substr(2, 16)}`

    // 更新出价记录的支付意图ID
    await supabase
      .from('offers')
      .update({ prepayment_intent_id: paymentIntentId })
      .eq('id', offer.id)

    return {
      success: true,
      data: {
        client_secret: clientSecret,
        deposit_amount: depositAmount,
        currency: form.currency,
        offer_id: offer.id
      }
    }

  } catch (error: any) {
    return {
      success: false,
      error: {
        code: 'STRIPE_ERROR',
        message: error.message || 'Payment processing failed'
      }
    }
  }
}

// 2. 商家接受出价（生成尾款意图）
export async function acceptOffer(offerId: string): Promise<CreateOfferResponse> {
  try {
    // 获取出价信息
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select(`
        *,
        bid_forms!inner(*)
      `)
      .eq('id', offerId)
      .single()

    if (offerError || !offer) {
      return {
        success: false,
        error: {
          code: 'OFFER_NOT_FOUND',
          message: 'Offer not found'
        }
      }
    }

    // 验证定金已支付
    if (offer.prepayment_status !== 'succeeded') {
      return {
        success: false,
        error: {
          code: 'DEPOSIT_NOT_PAID',
          message: 'Deposit has not been paid'
        }
      }
    }

    // 验证尾款未支付
    if (offer.balance_payment_status === 'succeeded') {
      return {
        success: false,
        error: {
          code: 'ALREADY_FINALIZED',
          message: 'Final payment already completed'
        }
      }
    }

    // 计算尾款金额
    const depositAmount = Math.ceil(offer.offer_amount * 0.1)
    const finalAmount = offer.offer_amount - depositAmount

    // 创建尾款 PaymentIntent (模拟)
    const paymentIntentId = `pi_final_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36).substr(2, 16)}`

    // 更新出价状态
    await supabase
      .from('offers')
      .update({
        status: 'accepted',
        balance_payment_intent_id: paymentIntentId,
        balance_payment_status: 'pending'
      })
      .eq('id', offerId)

    return {
      success: true,
      data: {
        client_secret: clientSecret,
        deposit_amount: finalAmount,
        currency: offer.bid_forms.currency,
        offer_id: offerId
      }
    }

  } catch (error: any) {
    return {
      success: false,
      error: {
        code: 'STRIPE_ERROR',
        message: error.message || 'Payment processing failed'
      }
    }
  }
}

// 3. 商家拒绝出价（定金退款）
export async function rejectOffer(offerId: string, reason?: string): Promise<{ success: boolean; error?: any }> {
  try {
    // 获取出价信息
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('*')
      .eq('id', offerId)
      .single()

    if (offerError || !offer) {
      return {
        success: false,
        error: {
          code: 'OFFER_NOT_FOUND',
          message: 'Offer not found'
        }
      }
    }

    // 验证定金已支付
    if (offer.prepayment_status !== 'succeeded') {
      return {
        success: false,
        error: {
          code: 'DEPOSIT_NOT_PAID',
          message: 'No deposit to refund'
        }
      }
    }

    // 模拟退款处理
    console.log(`Refunding deposit for offer ${offerId}, reason: ${reason}`)

    // 更新出价状态
    await supabase
      .from('offers')
      .update({
        status: 'rejected',
        prepayment_status: 'refunded'
      })
      .eq('id', offerId)

    return { success: true }

  } catch (error: any) {
    return {
      success: false,
      error: {
        code: 'REFUND_FAILED',
        message: error.message || 'Refund processing failed'
      }
    }
  }
}

// 4. 查询表单的有效出价（仅商家）
export async function listOffers(formId: string, onlyPaid: boolean = false) {
  try {
    let query = supabase
      .from('offers')
      .select('*')
      .eq('form_id', formId)
      .order('created_at', { ascending: false })

    if (onlyPaid) {
      query = query.eq('prepayment_status', 'succeeded')
    }

    const { data: offers, error } = await query

    if (error) throw error

    return {
      success: true,
      data: offers || []
    }

  } catch (error: any) {
    return {
      success: false,
      error: {
        code: 'QUERY_FAILED',
        message: error.message || 'Failed to fetch offers'
      }
    }
  }
}

// 模拟支付确认
export async function confirmPayment(paymentIntentId: string, type: 'deposit' | 'final') {
  try {
    // 模拟支付成功
    const updateField = type === 'deposit' ? 'prepayment_status' : 'balance_payment_status'
    
    const { error } = await supabase
      .from('offers')
      .update({ [updateField]: 'succeeded' })
      .eq(type === 'deposit' ? 'prepayment_intent_id' : 'balance_payment_intent_id', paymentIntentId)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}