import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export type Database = {
  public: {
    Tables: {
      merchants: {
        Row: {
          id: string
          user_id: string
          business_name: string | null
          stripe_account_id: string | null
          subscription_tier: 'free' | 'basic' | 'pro'
          subscription_status: 'active' | 'canceled' | 'past_due'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name?: string | null
          stripe_account_id?: string | null
          subscription_tier?: 'free' | 'basic' | 'pro'
          subscription_status?: 'active' | 'canceled' | 'past_due'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string | null
          stripe_account_id?: string | null
          subscription_tier?: 'free' | 'basic' | 'pro'
          subscription_status?: 'active' | 'canceled' | 'past_due'
          created_at?: string
          updated_at?: string
        }
      }
      bid_forms: {
        Row: {
          id: string
          merchant_id: string
          title: string
          description: string | null
          price: number
          currency: string
          is_active: boolean
          theme_color: string
          custom_css: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          merchant_id: string
          title: string
          description?: string | null
          price: number
          currency?: string
          is_active?: boolean
          theme_color?: string
          custom_css?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          merchant_id?: string
          title?: string
          description?: string | null
          price?: number
          currency?: string
          is_active?: boolean
          theme_color?: string
          custom_css?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      offers: {
        Row: {
          id: string
          form_id: string
          buyer_email: string
          buyer_name: string | null
          offer_amount: number
          message: string | null
          status: 'pending' | 'accepted' | 'rejected' | 'expired'
          prepayment_intent_id: string | null
          balance_payment_intent_id: string | null
          prepayment_status: 'pending' | 'succeeded' | 'failed'
          balance_payment_status: 'pending' | 'succeeded' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          form_id: string
          buyer_email: string
          buyer_name?: string | null
          offer_amount: number
          message?: string | null
          status?: 'pending' | 'accepted' | 'rejected' | 'expired'
          prepayment_intent_id?: string | null
          balance_payment_intent_id?: string | null
          prepayment_status?: 'pending' | 'succeeded' | 'failed'
          balance_payment_status?: 'pending' | 'succeeded' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          form_id?: string
          buyer_email?: string
          buyer_name?: string | null
          offer_amount?: number
          message?: string | null
          status?: 'pending' | 'accepted' | 'rejected' | 'expired'
          prepayment_intent_id?: string | null
          balance_payment_intent_id?: string | null
          prepayment_status?: 'pending' | 'succeeded' | 'failed'
          balance_payment_status?: 'pending' | 'succeeded' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}