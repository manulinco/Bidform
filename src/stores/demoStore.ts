import { create } from 'zustand'

interface DemoProduct {
  id: string
  title: string
  price: number
  currency: string
  minBidRatio: number
  depositPercentage: number
  allowOptionalMessage: boolean
  description?: string
  theme_color: string
}

interface DemoOffer {
  id: string
  buyerName: string
  buyerEmail: string
  offerAmount: number
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  depositStatus: 'pending' | 'succeeded' | 'failed' | 'refunded'
  finalStatus: 'pending' | 'succeeded' | 'failed'
  createdAt: string
}

interface DemoState {
  isDemo: boolean
  currentProduct: DemoProduct | null
  offers: DemoOffer[]
  
  // Actions
  initializeDemo: () => void
  addOffer: (offer: Omit<DemoOffer, 'id' | 'createdAt'>) => void
  updateOfferStatus: (offerId: string, status: DemoOffer['status']) => void
  
  // Demo bid forms
  demoBidForms: DemoProduct[]
  createDemoBidForm: (form: Omit<DemoProduct, 'id'>) => void
}

const demoProducts: DemoProduct[] = [
  {
    id: 'demo-vintage-watch',
    title: '1960年代劳力士古董腕表',
    description: '稀有的1960年代劳力士Submariner，保存完好，带原装表盒和证书。这是一款极具收藏价值的古董腕表。',
    price: 25000,
    currency: 'CNY',
    minBidRatio: 70,
    depositPercentage: 10,
    allowOptionalMessage: true,
    theme_color: '#7C3AED'
  },
  {
    id: 'demo-art-painting',
    title: '现代抽象油画作品',
    description: '知名艺术家创作的现代抽象油画，尺寸120x80cm，已装裱，适合收藏或装饰。',
    price: 8800,
    currency: 'CNY',
    minBidRatio: 60,
    depositPercentage: 15,
    allowOptionalMessage: true,
    theme_color: '#EC4899'
  },
  {
    id: 'demo-vintage-car',
    title: '1985年保时捷911经典跑车',
    description: '经典的1985年保时捷911 Carrera，里程数较低，保养记录完整，是收藏家的理想选择。',
    price: 180000,
    currency: 'CNY',
    minBidRatio: 80,
    depositPercentage: 5,
    allowOptionalMessage: true,
    theme_color: '#F59E0B'
  }
]

export const useDemoStore = create<DemoState>((set, get) => ({
  isDemo: true,
  currentProduct: null,
  offers: [],
  demoBidForms: demoProducts,

  initializeDemo: () => {
    // 随机选择一个演示产品
    const randomProduct = demoProducts[Math.floor(Math.random() * demoProducts.length)]
    set({ 
      currentProduct: randomProduct,
      isDemo: true 
    })
  },

  addOffer: (offerData) => {
    const newOffer: DemoOffer = {
      ...offerData,
      id: `demo-offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }
    
    set(state => ({
      offers: [newOffer, ...state.offers]
    }))
  },

  updateOfferStatus: (offerId, status) => {
    set(state => ({
      offers: state.offers.map(offer => 
        offer.id === offerId 
          ? { ...offer, status }
          : offer
      )
    }))
  },

  createDemoBidForm: (formData) => {
    const newForm: DemoProduct = {
      ...formData,
      id: `demo-form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    
    set(state => ({
      demoBidForms: [newForm, ...state.demoBidForms]
    }))
  }
}))

// 导出演示数据供其他组件使用
export { demoProducts }