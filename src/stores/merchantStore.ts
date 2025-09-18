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
        await get().createMerchant(userId, '演示商家')
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
      business_name: '演示商家',
      created_at: new Date().toISOString()
    }

    const demoBidForms: BidForm[] = [
      {
        id: 'demo-vintage-watch',
        merchant_id: 'demo-merchant-123',
        title: '1960年代劳力士古董腕表',
        description: '稀有的1960年代劳力士Submariner，保存完好，带原装表盒和证书。这是一款极具收藏价值的古董腕表，适合投资和收藏。',
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
        title: '现代抽象油画作品',
        description: '知名艺术家创作的现代抽象油画，尺寸120x80cm，已装裱，适合收藏或装饰。作品具有很高的艺术价值和升值潜力。',
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
        title: '1985年保时捷911经典跑车',
        description: '经典的1985年保时捷911 Carrera，里程数较低，保养记录完整，是收藏家的理想选择。车况优良，具有很高的收藏价值。',
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
        buyer_name: '张先生',
        offer_amount: 22000,
        message: '这块表很有收藏价值，我是专业的古董表收藏家，希望能够成交。',
        status: 'pending',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo-offer-2',
        form_id: 'demo-art-painting',
        buyer_email: 'li.artist@example.com',
        buyer_name: '李女士',
        offer_amount: 7500,
        message: '很喜欢这幅画的风格，希望能够收藏。我是艺术爱好者，这幅画很适合我的收藏。',
        status: 'accepted',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo-offer-3',
        form_id: 'demo-vintage-watch',
        buyer_email: 'wang.investor@example.com',
        buyer_name: '王总',
        offer_amount: 26000,
        message: '我对这款劳力士很感兴趣，价格可以商量。我有多年的投资经验，希望能够收藏这块表。',
        status: 'pending',
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo-offer-4',
        form_id: 'demo-vintage-car',
        buyer_email: 'chen.racer@example.com',
        buyer_name: '陈先生',
        offer_amount: 175000,
        message: '我是保时捷爱好者，这辆911非常经典。希望能够成为它的新主人。',
        status: 'pending',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo-offer-5',
        form_id: 'demo-art-painting',
        buyer_email: 'liu.gallery@example.com',
        buyer_name: '刘馆长',
        offer_amount: 9200,
        message: '我们画廊对这幅作品很感兴趣，希望能够展出。',
        status: 'rejected',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo-offer-6',
        form_id: 'demo-vintage-watch',
        buyer_email: 'zhao.watch@example.com',
        buyer_name: '赵女士',
        offer_amount: 20000,
        message: '这是给我先生的生日礼物，他很喜欢古董表。',
        status: 'rejected',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo-offer-7',
        form_id: 'demo-vintage-car',
        buyer_email: 'sun.collector@example.com',
        buyer_name: '孙总',
        offer_amount: 185000,
        message: '我收藏了很多经典跑车，这辆911是我一直在寻找的型号。价格合理，希望能够成交。',
        status: 'accepted',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo-offer-8',
        form_id: 'demo-art-painting',
        buyer_email: 'wu.designer@example.com',
        buyer_name: '吴设计师',
        offer_amount: 8000,
        message: '作为室内设计师，我觉得这幅画很适合我正在设计的项目。',
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