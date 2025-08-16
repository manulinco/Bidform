import { create } from 'zustand'
import { supabase, Database } from '../lib/supabase'

type Merchant = Database['public']['Tables']['merchants']['Row']
type BidForm = Database['public']['Tables']['bid_forms']['Row']
type Offer = Database['public']['Tables']['offers']['Row']

interface MerchantState {
  merchant: Merchant | null
  bidForms: BidForm[]
  offers: Offer[]
  loading: boolean
  
  // Actions
  createMerchant: (userId: string, businessName?: string) => Promise<void>
  fetchMerchant: (userId: string) => Promise<void>
  createBidForm: (formData: Omit<BidForm, 'id' | 'created_at' | 'updated_at'>) => Promise<BidForm>
  fetchBidForms: (merchantId: string) => Promise<void>
  fetchOffers: (merchantId: string) => Promise<void>
  updateOfferStatus: (offerId: string, status: 'accepted' | 'rejected') => Promise<void>
}

export const useMerchantStore = create<MerchantState>((set, get) => ({
  merchant: null,
  bidForms: [],
  offers: [],
  loading: false,

  createMerchant: async (userId: string, businessName?: string) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('merchants')
        .insert({
          user_id: userId,
          business_name: businessName,
          subscription_tier: 'free',
          subscription_status: 'active'
        })
        .select()
        .single()

      if (error) throw error
      set({ merchant: data })
    } finally {
      set({ loading: false })
    }
  },

  fetchMerchant: async (userId: string) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('merchants')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      set({ merchant: data })
    } finally {
      set({ loading: false })
    }
  },

  createBidForm: async (formData) => {
    const { data, error } = await supabase
      .from('bid_forms')
      .insert(formData)
      .select()
      .single()

    if (error) throw error
    
    // Update local state
    set(state => ({
      bidForms: [...state.bidForms, data]
    }))
    
    return data
  },

  fetchBidForms: async (merchantId: string) => {
    const { data, error } = await supabase
      .from('bid_forms')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false })

    if (error) throw error
    set({ bidForms: data || [] })
  },

  fetchOffers: async (merchantId: string) => {
    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        bid_forms!inner(merchant_id)
      `)
      .eq('bid_forms.merchant_id', merchantId)
      .order('created_at', { ascending: false })

    if (error) throw error
    set({ offers: data || [] })
  },

  updateOfferStatus: async (offerId: string, status: 'accepted' | 'rejected') => {
    const { error } = await supabase
      .from('offers')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', offerId)

    if (error) throw error

    // Update local state
    set(state => ({
      offers: state.offers.map(offer => 
        offer.id === offerId 
          ? { ...offer, status, updated_at: new Date().toISOString() }
          : offer
      )
    }))
  }
}))