import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { BidForm, Merchant, Offer, Stats, normalizeBidForm, normalizeOffer } from '../types'

interface MerchantState {
  merchant: Merchant | null
  bidForms: BidForm[]
  offers: Offer[]
  loading: boolean
  stats: Stats
  
  // Actions
  initialize: (userId: string) => Promise<void>
  createMerchant: (userId: string, businessName?: string) => Promise<void>
  fetchMerchant: (userId: string) => Promise<void>
  createBidForm: (formData: any) => Promise<BidForm>
  fetchBidForms: (merchantId?: string) => Promise<BidForm[] | void>
  fetchOffers: (merchantId: string) => Promise<void>
  updateOfferStatus: (offerId: string, status: 'accepted' | 'rejected') => Promise<void>
  createDemoData: () => void
}

export const useMerchantStore = create<MerchantState>((set, get) => ({
  merchant: null,
  bidForms: [],
  offers: [],
  loading: false,
  stats: {
    totalOffers: 0,
    acceptedOffers: 0,
    totalRevenue: 0
  },

  initialize: async (userId: string) => {
    set({ loading: true })
    try {
      // 在演示模式下，直接创建演示数据
      if (!supabase || typeof supabase.from !== 'function') {
        get().createDemoData()
        return
      }

      await get().fetchMerchant(userId)
      
      // 如果没有商家记录，创建一个
      if (!get().merchant) {
        await get().createMerchant(userId, 'Demo Merchant')
      }
      
      // 获取表单和出价
      const merchant = get().merchant
      if (merchant) {
        await get().fetchBidForms(merchant.id)
        await get().fetchOffers(merchant.id)
      }
    } catch (error) {
      console.error('Initialize merchant error:', error)
      // 如果数据库操作失败，创建演示数据
      get().createDemoData()
    } finally {
      set({ loading: false })
    }
  },

  createDemoData: () => {
    const demoMerchant: Merchant = {
      id: 'demo-merchant-123',
      user_id: 'demo-user-123',
      business_name: 'Demo Merchant',
      created_at: new Date().toISOString()
    }

    const demoBidForms: BidForm[] = [
      {
        id: 'demo-vintage-watch',
        merchant_id: 'demo-merchant-123',
        title: '1960s Vintage Rolex Watch',
        description: 'Rare 1960s Rolex Submariner in excellent condition with original box and certificate. A highly collectible vintage timepiece perfect for investment and collection.',
        price: 25000,
        currency: 'CNY',
        min_bid_ratio: 70,
        deposit_percentage: 10,
        is_active: true,
        theme_color: '#7C3AED',
        allow_optional_message: true,
        image_url: 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?q=80&w=1200&auto=format&fit=crop',
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-art-painting',
        merchant_id: 'demo-merchant-123',
        title: 'Modern Abstract Oil Painting',
        description: 'Contemporary abstract oil painting by renowned artist, 120x80cm, professionally framed. Perfect for collection or decoration with high artistic value and appreciation potential.',
        price: 8800,
        currency: 'CNY',
        min_bid_ratio: 60,
        deposit_percentage: 15,
        is_active: true,
        theme_color: '#EC4899',
        allow_optional_message: true,
        image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-vintage-car',
        merchant_id: 'demo-merchant-123',
        title: '1985 Porsche 911 Classic Sports Car',
        description: 'Classic 1985 Porsche 911 Carrera with low mileage and complete maintenance records. Ideal choice for collectors with excellent condition and high collectible value.',
        price: 180000,
        currency: 'CNY',
        min_bid_ratio: 80,
        deposit_percentage: 5,
        is_active: true,
        theme_color: '#F59E0B',
        allow_optional_message: true,
        image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
        created_at: new Date().toISOString()
      }
    ]

    const demoOffers: Offer[] = [
      {
        id: 'demo-offer-1',
        form_id: 'demo-vintage-watch',
        buyer_email: 'zhang.collector@example.com',
        buyer_name: 'Mr. Zhang',
        offer_amount: 22000,
        message: 'This watch has great collectible value. I am a professional vintage watch collector and hope to complete this transaction.',
        status: 'pending',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo-offer-2',
        form_id: 'demo-art-painting',
        buyer_email: 'li.artist@example.com',
        buyer_name: 'Ms. Li',
        offer_amount: 7500,
        message: 'I really love the style of this painting and hope to add it to my collection. As an art enthusiast, this piece would fit perfectly in my collection.',
        status: 'accepted',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo-offer-3',
        form_id: 'demo-vintage-watch',
        buyer_email: 'wang.investor@example.com',
        buyer_name: 'Mr. Wang',
        offer_amount: 26000,
        message: 'I am very interested in this Rolex, and the price is negotiable. With years of investment experience, I hope to add this watch to my collection.',
        status: 'pending',
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo-offer-4',
        form_id: 'demo-vintage-car',
        buyer_email: 'chen.racer@example.com',
        buyer_name: 'Mr. Chen',
        offer_amount: 175000,
        message: 'I am a Porsche enthusiast, and this 911 is absolutely classic. I hope to become its new owner.',
        status: 'pending',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo-offer-5',
        form_id: 'demo-art-painting',
        buyer_email: 'liu.gallery@example.com',
        buyer_name: 'Director Liu',
        offer_amount: 9200,
        message: 'Our gallery is very interested in this artwork and would like to exhibit it.',
        status: 'rejected',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo-offer-6',
        form_id: 'demo-vintage-watch',
        buyer_email: 'zhao.watch@example.com',
        buyer_name: 'Ms. Zhao',
        offer_amount: 20000,
        message: 'This is a birthday gift for my husband, who loves vintage watches.',
        status: 'rejected',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo-offer-7',
        form_id: 'demo-vintage-car',
        buyer_email: 'sun.collector@example.com',
        buyer_name: 'Mr. Sun',
        offer_amount: 185000,
        message: 'I have collected many classic sports cars, and this 911 is the model I have been looking for. The price is reasonable, and I hope to complete the transaction.',
        status: 'accepted',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo-offer-8',
        form_id: 'demo-art-painting',
        buyer_email: 'wu.designer@example.com',
        buyer_name: 'Designer Wu',
        offer_amount: 8000,
        message: 'As an interior designer, I think this painting would be perfect for the project I am currently designing.',
        status: 'pending',
        created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      }
    ]

    set({
      merchant: demoMerchant,
      bidForms: demoBidForms,
      offers: demoOffers,
      stats: {
        totalOffers: demoOffers.length,
        acceptedOffers: demoOffers.filter(o => o.status === 'accepted').length,
        totalRevenue: demoOffers.filter(o => o.status === 'accepted').reduce((sum, o) => sum + (o.offer_amount || 0), 0)
      }
    })
  },

  createMerchant: async (userId: string, businessName?: string) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('merchants')
        .insert({
          user_id: userId,
          business_name: businessName || 'My Business'
        })
        .select()
        .single()

      if (error) throw error
      set({ merchant: data })
    } catch (error: any) {
      console.error('Create merchant error:', error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  fetchMerchant: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('merchants')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      set({ merchant: data })
    } catch (error: any) {
      console.error('Fetch merchant error:', error)
      throw error
    }
  },

  createBidForm: async (formData: any) => {
    try {
      // 转换数据格式以匹配新的 API
      const apiFormData = {
        title: formData.title,
        description: formData.description,
        starting_price: parseFloat(formData.price || formData.starting_price),
        currency: formData.currency || 'USD',
        deposit_percentage: parseInt(formData.deposit_percentage || '10'),
        minimum_bid_ratio: parseInt(formData.min_bid_ratio || formData.minimum_bid_ratio || '70'),
        theme_color: formData.theme_color || '#ee5e3a',
        allow_messages: formData.allow_optional_message !== false
      }

      // 使用新的 products API
      const { createBidForm } = await import('../api/products')
      const data = await createBidForm(apiFormData)

      const normalizedData = normalizeBidForm(data)
      set(state => ({
        bidForms: [normalizedData, ...state.bidForms]
      }))

      return data
    } catch (error: any) {
      console.error('Create bid form error:', error)
      throw error
    }
  },

  fetchBidForms: async (merchantId?: string) => {
    try {
      // 使用新的 products API
      const { getBidForms } = await import('../api/products')
      const data = await getBidForms()

      const normalizedData = (data || []).map(normalizeBidForm)
      set({ bidForms: normalizedData })
      return data
    } catch (error: any) {
      console.error('Fetch bid forms error:', error)
      // 如果是表不存在的错误，返回空数组
      if (error.message?.includes('bid_forms') || error.message?.includes('relation') || error.message?.includes('table')) {
        set({ bidForms: [] })
        return []
      }
      throw error
    }
  },

  fetchOffers: async (merchantId: string) => {
    try {
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
    } catch (error: any) {
      console.error('Fetch offers error:', error)
      throw error
    }
  },

  updateOfferStatus: async (offerId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status })
        .eq('id', offerId)

      if (error) throw error

      set(state => ({
        offers: state.offers.map(offer =>
          offer.id === offerId ? { ...offer, status } : offer
        )
      }))
    } catch (error: any) {
      console.error('Update offer status error:', error)
      throw error
    }
  }
}))