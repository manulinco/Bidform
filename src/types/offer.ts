/**
 * 出价相关的类型定义
 * 用于前端组件和状态管理
 */

export interface Offer {
  id: string
  formId: string
  buyerName: string
  buyerEmail: string
  offerAmount: number
  message?: string
  status: OfferStatus
  depositStatus: PaymentStatus
  finalStatus: PaymentStatus
  createdAt: string
  updatedAt?: string
  acceptedAt?: string
  rejectedAt?: string
  // Stripe 相关
  depositIntentId?: string
  finalIntentId?: string
}

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'expired'

export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded'

export interface Product {
  id: string
  title: string
  price: number
  currency: string
  minBidRatio: number // 最低出价比例 (0-100)
  depositPercentage: number // 定金比例 (0-100)
  allowOptionalMessage: boolean
  merchantId?: string
  isActive?: boolean
  createdAt?: string
}

export interface OfferFormData {
  buyerName: string
  buyerEmail: string
  offerAmount: number
  message: string
}

export interface OfferSummary {
  totalOffers: number
  pendingOffers: number
  acceptedOffers: number
  rejectedOffers: number
  totalValue: number
  averageOffer: number
  conversionRate: number
}

// Demo 模式专用类型
export interface DemoOffer extends Omit<Offer, 'formId' | 'merchantId'> {
  // Demo 模式下不需要 formId 和 merchantId
}

export interface DemoProduct extends Product {
  // Demo 产品可能有额外的展示属性
  description?: string
  imageUrl?: string
  category?: string
}

// API 响应类型
export interface CreateOfferResponse {
  offer: Offer
  clientSecret?: string // Stripe Payment Intent 的 client secret
  error?: string
}

export interface UpdateOfferStatusRequest {
  offerId: string
  status: OfferStatus
  reason?: string
}

// 组件 Props 类型
export interface BidWidgetProps {
  formId?: string
  title: string
  price: number
  currency: string
  themeColor?: string
  minBidRatio?: number
  depositPercentage?: number
  allowOptionalMessage?: boolean
  onOfferSubmitted?: (offer: Offer) => void
  onPaymentCompleted?: (offer: Offer) => void
}

export interface OfferListProps {
  offers: Offer[]
  onStatusChange: (offerId: string, status: OfferStatus) => void
  loading?: boolean
  emptyMessage?: string
}

// 筛选和排序
export interface OfferFilters {
  status?: OfferStatus[]
  dateRange?: {
    start: Date
    end: Date
  }
  minAmount?: number
  maxAmount?: number
  searchQuery?: string
}

export type OfferSortField = 'createdAt' | 'offerAmount' | 'status' | 'buyerName'
export type SortDirection = 'asc' | 'desc'

export interface OfferSort {
  field: OfferSortField
  direction: SortDirection
}