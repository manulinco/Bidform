// 统一的类型定义文件
// 兼容新旧数据库结构

export interface BidForm {
  id: string;
  title: string;
  description?: string;
  starting_price?: number;
  price?: number; // 向后兼容
  currency: string;
  deposit_percentage: number;
  minimum_bid_ratio?: number;
  min_bid_ratio?: number; // 向后兼容
  theme_color: string;
  allow_messages?: boolean;
  allow_optional_message?: boolean; // 向后兼容
  status?: 'active' | 'paused' | 'completed' | 'cancelled' | 'ended';
  is_active?: boolean; // 向后兼容
  image_url?: string; // 产品图片URL
  created_at: string;
  updated_at?: string;
  user_id?: string;
  merchant_id?: string; // 向后兼容
}

export interface CreateBidFormData {
  title: string;
  description?: string;
  starting_price: number;
  currency?: string;
  deposit_percentage?: number;
  minimum_bid_ratio?: number;
  theme_color?: string;
  allow_messages?: boolean;
}

export interface Merchant {
  id: string;
  user_id: string;
  business_name?: string;
  name?: string;
  email?: string;
  created_at: string;
  updated_at?: string;
}

export interface Offer {
  id: string;
  form_id: string;
  bid_form_id?: string;
  buyer_email: string;
  buyer_name: string | null;
  offer_amount: number;
  bid_amount?: number;
  message: string | null;
  buyer_message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  prepayment_intent_id: string | null;
  balance_payment_intent_id: string | null;
  prepayment_status: 'pending' | 'succeeded' | 'failed' | null;
  balance_payment_status: 'pending' | 'succeeded' | 'failed' | null;
  created_at: string;
  updated_at: string;
}

export interface Stats {
  totalOffers: number;
  acceptedOffers: number;
  totalRevenue: number;
}

// 工具函数：标准化 BidForm 对象
export function normalizeBidForm(form: any): BidForm {
  return {
    id: form.id,
    title: form.title,
    description: form.description,
    starting_price: form.starting_price || form.price || form.base_price,
    price: form.price || form.starting_price || form.base_price,
    currency: form.currency || 'USD',
    deposit_percentage: form.deposit_percentage || 10,
    minimum_bid_ratio: form.minimum_bid_ratio || form.min_bid_ratio || 70,
    min_bid_ratio: form.min_bid_ratio || form.minimum_bid_ratio || 70,
    theme_color: form.theme_color || '#ee5e3a',
    allow_messages: form.allow_messages ?? form.allow_optional_message ?? true,
    allow_optional_message: form.allow_optional_message ?? form.allow_messages ?? true,
    status: form.status || (form.is_active ? 'active' : 'paused'),
    is_active: form.is_active ?? (form.status === 'active'),
    image_url: form.image_url || 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?q=80&w=1200&auto=format&fit=crop',
    created_at: form.created_at,
    updated_at: form.updated_at,
    user_id: form.user_id,
    merchant_id: form.merchant_id
  };
}

// 工具函数：标准化 Offer 对象
export function normalizeOffer(offer: any): Offer {
  return {
    id: offer.id,
    form_id: offer.form_id || offer.bid_form_id || '',
    bid_form_id: offer.bid_form_id || offer.form_id,
    buyer_email: offer.buyer_email || offer.bidder_email,
    buyer_name: offer.buyer_name || offer.bidder_name || null,
    offer_amount: offer.offer_amount || offer.bid_amount || 0,
    bid_amount: offer.bid_amount || offer.offer_amount,
    message: offer.message || offer.buyer_message || null,
    buyer_message: offer.buyer_message || offer.message,
    status: offer.status || 'pending',
    prepayment_intent_id: offer.prepayment_intent_id || null,
    balance_payment_intent_id: offer.balance_payment_intent_id || null,
    prepayment_status: offer.prepayment_status || null,
    balance_payment_status: offer.balance_payment_status || null,
    created_at: offer.created_at,
    updated_at: offer.updated_at || offer.created_at
  };
}