// 数据库类型定义
// 基于 database/schema.sql 生成的 TypeScript 类型

export interface Database {
  public: {
    Tables: {
      merchants: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          name: string;
          company_name: string | null;
          website_url: string | null;
          stripe_account_id: string | null;
          stripe_onboarding_completed: boolean;
          subscription_plan: 'free' | 'basic' | 'pro';
          subscription_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          name: string;
          company_name?: string | null;
          website_url?: string | null;
          stripe_account_id?: string | null;
          stripe_onboarding_completed?: boolean;
          subscription_plan?: 'free' | 'basic' | 'pro';
          subscription_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          name?: string;
          company_name?: string | null;
          website_url?: string | null;
          stripe_account_id?: string | null;
          stripe_onboarding_completed?: boolean;
          subscription_plan?: 'free' | 'basic' | 'pro';
          subscription_status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      bid_forms: {
        Row: {
          id: string;
          merchant_id: string;
          title: string;
          description: string | null;
          product_name: string;
          base_price: number;
          min_bid_amount: number | null;
          max_bid_amount: number | null;
          currency: string;
          quantity_available: number;
          bid_end_date: string | null;
          auto_accept_threshold: number | null;
          deposit_percentage: number;
          theme_color: string;
          custom_css: string | null;
          embed_code: string | null;
          status: 'active' | 'paused' | 'ended';
          total_bids: number;
          highest_bid: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          merchant_id: string;
          title: string;
          description?: string | null;
          product_name: string;
          base_price: number;
          min_bid_amount?: number | null;
          max_bid_amount?: number | null;
          currency?: string;
          quantity_available?: number;
          bid_end_date?: string | null;
          auto_accept_threshold?: number | null;
          deposit_percentage?: number;
          theme_color?: string;
          custom_css?: string | null;
          embed_code?: string | null;
          status?: 'active' | 'paused' | 'ended';
          total_bids?: number;
          highest_bid?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          merchant_id?: string;
          title?: string;
          description?: string | null;
          product_name?: string;
          base_price?: number;
          min_bid_amount?: number | null;
          max_bid_amount?: number | null;
          currency?: string;
          quantity_available?: number;
          bid_end_date?: string | null;
          auto_accept_threshold?: number | null;
          deposit_percentage?: number;
          theme_color?: string;
          custom_css?: string | null;
          embed_code?: string | null;
          status?: 'active' | 'paused' | 'ended';
          total_bids?: number;
          highest_bid?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      offers: {
        Row: {
          id: string;
          bid_form_id: string;
          bidder_name: string;
          bidder_email: string;
          bidder_phone: string | null;
          bid_amount: number;
          quantity: number;
          message: string | null;
          deposit_amount: number;
          remaining_amount: number;
          status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
          payment_intent_id: string | null;
          deposit_payment_status: 'pending' | 'paid' | 'failed';
          final_payment_status: 'pending' | 'paid' | 'failed';
          accepted_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          bid_form_id: string;
          bidder_name: string;
          bidder_email: string;
          bidder_phone?: string | null;
          bid_amount: number;
          quantity?: number;
          message?: string | null;
          deposit_amount: number;
          remaining_amount: number;
          status?: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
          payment_intent_id?: string | null;
          deposit_payment_status?: 'pending' | 'paid' | 'failed';
          final_payment_status?: 'pending' | 'paid' | 'failed';
          accepted_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          bid_form_id?: string;
          bidder_name?: string;
          bidder_email?: string;
          bidder_phone?: string | null;
          bid_amount?: number;
          quantity?: number;
          message?: string | null;
          deposit_amount?: number;
          remaining_amount?: number;
          status?: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
          payment_intent_id?: string | null;
          deposit_payment_status?: 'pending' | 'paid' | 'failed';
          final_payment_status?: 'pending' | 'paid' | 'failed';
          accepted_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          offer_id: string;
          merchant_id: string;
          stripe_payment_intent_id: string;
          amount: number;
          currency: string;
          payment_type: 'deposit' | 'final';
          status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
          stripe_fee: number | null;
          platform_fee: number | null;
          merchant_amount: number | null;
          processed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          offer_id: string;
          merchant_id: string;
          stripe_payment_intent_id: string;
          amount: number;
          currency?: string;
          payment_type: 'deposit' | 'final';
          status?: 'pending' | 'succeeded' | 'failed' | 'cancelled';
          stripe_fee?: number | null;
          platform_fee?: number | null;
          merchant_amount?: number | null;
          processed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          offer_id?: string;
          merchant_id?: string;
          stripe_payment_intent_id?: string;
          amount?: number;
          currency?: string;
          payment_type?: 'deposit' | 'final';
          status?: 'pending' | 'succeeded' | 'failed' | 'cancelled';
          stripe_fee?: number | null;
          platform_fee?: number | null;
          merchant_amount?: number | null;
          processed_at?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          merchant_id: string;
          type: string;
          title: string;
          message: string;
          read: boolean;
          related_offer_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          merchant_id: string;
          type: string;
          title: string;
          message: string;
          read?: boolean;
          related_offer_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          merchant_id?: string;
          type?: string;
          title?: string;
          message?: string;
          read?: boolean;
          related_offer_id?: string | null;
          created_at?: string;
        };
      };
      system_settings: {
        Row: {
          key: string;
          value: string;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: string;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: string;
          description?: string | null;
          updated_at?: string;
        };
      };
      bid_form_stats: {
        Row: {
          id: string;
          title: string;
          status: 'active' | 'paused' | 'ended';
          total_offers: number;
          highest_bid: number;
          average_bid: number;
          total_accepted_value: number;
          accepted_offers: number;
        };
      };
      merchant_dashboard_stats: {
        Row: {
          merchant_id: string;
          total_forms: number;
          total_offers: number;
          accepted_offers: number;
          total_revenue: number;
          active_forms: number;
        };
      };
    };
    Views: {
      bid_form_stats: {
        Row: {
          id: string;
          title: string;
          status: 'active' | 'paused' | 'ended';
          total_offers: number;
          highest_bid: number;
          average_bid: number;
          total_accepted_value: number;
          accepted_offers: number;
        };
      };
      merchant_dashboard_stats: {
        Row: {
          merchant_id: string;
          total_forms: number;
          total_offers: number;
          accepted_offers: number;
          total_revenue: number;
          active_forms: number;
        };
      };
    };
    Functions: {
      generate_embed_code: {
        Args: {
          form_id: string;
        };
        Returns: string;
      };
      calculate_platform_fee: {
        Args: {
          amount: number;
          plan: string;
        };
        Returns: number;
      };
    };
  };
}

// 常用类型别名
export type Merchant = Database['public']['Tables']['merchants']['Row'];
export type BidForm = Database['public']['Tables']['bid_forms']['Row'];
export type Offer = Database['public']['Tables']['offers']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];

// 插入类型
export type MerchantInsert = Database['public']['Tables']['merchants']['Insert'];
export type BidFormInsert = Database['public']['Tables']['bid_forms']['Insert'];
export type OfferInsert = Database['public']['Tables']['offers']['Insert'];
export type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];

// 更新类型
export type MerchantUpdate = Database['public']['Tables']['merchants']['Update'];
export type BidFormUpdate = Database['public']['Tables']['bid_forms']['Update'];
export type OfferUpdate = Database['public']['Tables']['offers']['Update'];
export type PaymentUpdate = Database['public']['Tables']['payments']['Update'];
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];

// 统计类型
export type BidFormStats = Database['public']['Views']['bid_form_stats']['Row'];
export type MerchantDashboardStats = Database['public']['Views']['merchant_dashboard_stats']['Row'];

// 枚举类型
export type SubscriptionPlan = 'free' | 'basic' | 'pro';
export type BidFormStatus = 'active' | 'paused' | 'ended';
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'cancelled';
export type PaymentType = 'deposit' | 'final';

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页类型
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// 表单创建数据类型
export interface CreateBidFormData {
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
}

// 投标数据类型
export interface CreateOfferData {
  bid_form_id: string;
  bidder_name: string;
  bidder_email: string;
  bidder_phone?: string;
  bid_amount: number;
  quantity?: number;
  message?: string;
}

// 支付意图数据类型
export interface CreatePaymentIntentData {
  offer_id: string;
  payment_type: PaymentType;
  return_url?: string;
}

// Stripe 相关类型
export interface StripePaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

// Widget 配置类型
export interface WidgetConfig {
  form_id: string;
  theme_color?: string;
  custom_css?: string;
  show_logo?: boolean;
  compact_mode?: boolean;
}

// 仪表板统计类型
export interface DashboardStats {
  totalForms: number;
  activeForms: number;
  totalOffers: number;
  acceptedOffers: number;
  totalRevenue: number;
  pendingPayments: number;
  recentOffers: Offer[];
  topPerformingForms: BidFormStats[];
}

// 通知类型
export interface NotificationData {
  type: 'new_bid' | 'bid_accepted' | 'payment_received' | 'payment_failed' | 'form_expired';
  title: string;
  message: string;
  related_offer_id?: string;
}

// 错误类型
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// 搜索和过滤类型
export interface SearchFilters {
  status?: BidFormStatus[];
  date_range?: {
    start: string;
    end: string;
  };
  min_amount?: number;
  max_amount?: number;
  search_term?: string;
}

// 排序类型
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// 导出类型
export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf';
  date_range?: {
    start: string;
    end: string;
  };
  include_fields?: string[];
}