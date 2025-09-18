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
    title: '1960s Vintage Rolex Watch',
    description: 'Rare 1960s Rolex Submariner in excellent condition with original box and certificate. A highly collectible vintage timepiece.',
    price: 25000,
    currency: 'CNY',
    minBidRatio: 70,
    depositPercentage: 10,
    allowOptionalMessage: true,
    theme_color: '#7C3AED'
  },
  {
    id: 'demo-art-painting',
    title: 'Modern Abstract Oil Painting',
    description: 'Contemporary abstract oil painting by renowned artist, 120x80cm, professionally framed. Perfect for collection or decoration.',
    price: 8800,
    currency: 'CNY',
    minBidRatio: 60,
    depositPercentage: 15,
    allowOptionalMessage: true,
    theme_color: '#EC4899'
  },
  {
    id: 'demo-vintage-car',
    title: '1985 Porsche 911 Classic Sports Car',
    description: 'Classic 1985 Porsche 911 Carrera with low mileage and complete maintenance records. Ideal choice for collectors.',
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
    // Randomly select a demo product
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

// Export demo data for use by other components
export { demoProducts }