import { create } from 'zustand'

interface DemoOffer {
  id: string
  buyerName: string
  buyerEmail: string
  offerAmount: number
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  depositStatus: 'pending' | 'paid' | 'failed'
  finalStatus: 'pending' | 'paid' | 'failed'
  createdAt: string
}

interface DemoProduct {
  id: string
  title: string
  price: number
  currency: string
  minBidRatio: number
  depositPercentage: number
  allowOptionalMessage: boolean
}

interface DemoStore {
  isDemo: boolean
  offers: DemoOffer[]
  products: DemoProduct[]
  currentProduct: DemoProduct | null
  
  // Actions
  addOffer: (offer: Omit<DemoOffer, 'id' | 'createdAt'>) => void
  updateOfferStatus: (id: string, status: DemoOffer['status']) => void
  updateDepositStatus: (id: string, status: DemoOffer['depositStatus']) => void
  setCurrentProduct: (product: DemoProduct) => void
  initializeDemo: () => void
}

export const useDemoStore = create<DemoStore>((set, get) => ({
  isDemo: import.meta.env.VITE_DEMO_MODE === 'true',
  offers: [],
  products: [],
  currentProduct: null,

  addOffer: (offerData) => {
    const newOffer: DemoOffer = {
      ...offerData,
      id: `demo_offer_${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    set(state => ({
      offers: [...state.offers, newOffer]
    }))
  },

  updateOfferStatus: (id, status) => {
    set(state => ({
      offers: state.offers.map(offer => 
        offer.id === id ? { ...offer, status } : offer
      )
    }))
  },

  updateDepositStatus: (id, status) => {
    set(state => ({
      offers: state.offers.map(offer => 
        offer.id === id ? { ...offer, depositStatus: status } : offer
      )
    }))
  },

  setCurrentProduct: (product) => {
    set({ currentProduct: product })
  },

  initializeDemo: () => {
    const demoProducts: DemoProduct[] = [
      {
        id: 'demo_product_1',
        title: 'Vintage Rolex Submariner',
        price: 8500,
        currency: 'USD',
        minBidRatio: 70,
        depositPercentage: 10,
        allowOptionalMessage: true
      },
      {
        id: 'demo_product_2', 
        title: 'MacBook Pro M3 Max',
        price: 3200,
        currency: 'USD',
        minBidRatio: 80,
        depositPercentage: 15,
        allowOptionalMessage: true
      },
      {
        id: 'demo_product_3',
        title: 'Vintage Gibson Les Paul',
        price: 4500,
        currency: 'USD',
        minBidRatio: 60,
        depositPercentage: 20,
        allowOptionalMessage: true
      }
    ]

    const demoOffers: DemoOffer[] = [
      {
        id: 'demo_offer_1',
        buyerName: 'John Smith',
        buyerEmail: 'john@example.com',
        offerAmount: 7800,
        message: 'I\'ve been looking for this exact model. Very interested!',
        status: 'pending',
        depositStatus: 'paid',
        finalStatus: 'pending',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo_offer_2',
        buyerName: 'Sarah Johnson',
        buyerEmail: 'sarah@example.com', 
        offerAmount: 8200,
        message: 'Can you provide more photos of the watch face?',
        status: 'pending',
        depositStatus: 'paid',
        finalStatus: 'pending',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ]

    set({
      products: demoProducts,
      offers: demoOffers,
      currentProduct: demoProducts[0]
    })
  }
}))