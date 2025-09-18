import React, { useState } from 'react'
import { acceptOffer, rejectOffer } from '../../api/offers'
import { Offer } from '../../types'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Mail, 
  MessageSquare,
  CreditCard,
  RefreshCw,
  Filter,
  Search,
  Calendar,
  TrendingUp,
  Eye,
  Download
} from 'lucide-react'
import toast from 'react-hot-toast'

interface OffersListProps {
  offers: Offer[]
}

export const OffersList: React.FC<OffersListProps> = ({ offers }) => {
  const [loading, setLoading] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const handleAcceptOffer = async (offerId: string) => {
    setLoading(offerId)
    try {
      const result = await acceptOffer(offerId)
      if (result.success) {
        toast.success('Offer accepted! Final payment link generated.')
        // 这里可以发送支付链接给买家
        console.log('Final payment client_secret:', result.data?.client_secret)
      } else {
        toast.error(result.error?.message || 'Failed to accept offer')
      }
    } catch (error: any) {
      toast.error('Failed to accept offer')
    } finally {
      setLoading(null)
    }
  }

  const handleRejectOffer = async (offerId: string) => {
    const reason = prompt('Please provide a reason for rejection (optional):')
    
    setLoading(offerId)
    try {
      const result = await rejectOffer(offerId, reason || undefined)
      if (result.success) {
        toast.success('Offer rejected and deposit refunded.')
      } else {
        toast.error(result.error?.message || 'Failed to reject offer')
      }
    } catch (error: any) {
      toast.error('Failed to reject offer')
    } finally {
      setLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'accepted': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'expired': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'refunded': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // 过滤和排序逻辑
  const filteredOffers = offers
    .filter(offer => {
      const matchesStatus = filterStatus === 'all' || offer.status === filterStatus
      const matchesSearch = searchTerm === '' || 
        (offer.buyer_name && offer.buyer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        offer.buyer_email.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesStatus && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.created_at).getTime()
        const dateB = new Date(b.created_at).getTime()
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
      } else {
        return sortOrder === 'desc' ? b.offer_amount - a.offer_amount : a.offer_amount - b.offer_amount
      }
    })

  // 统计数据
  const stats = {
    total: offers.length,
    pending: offers.filter(o => o.status === 'pending').length,
    accepted: offers.filter(o => o.status === 'accepted').length,
    rejected: offers.filter(o => o.status === 'rejected').length,
    totalValue: offers.reduce((sum, o) => sum + o.offer_amount, 0),
    avgOffer: offers.length > 0 ? offers.reduce((sum, o) => sum + o.offer_amount, 0) / offers.length : 0
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No offers yet</h3>
        <p className="text-gray-600">Offers will appear here when buyers submit bids on your forms.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Offers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* 过滤和搜索 */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 搜索 */}
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by buyer name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* 状态过滤 */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          {/* 排序 */}
          <div className="flex items-center gap-2">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-')
                setSortBy(by as 'date' | 'amount')
                setSortOrder(order as 'asc' | 'desc')
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="date-desc">Latest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
          
          {/* 导出按钮 */}
          <button
            onClick={() => {
              const csvContent = [
                ['Date', 'Buyer Name', 'Email', 'Amount', 'Status', 'Message'].join(','),
                ...filteredOffers.map(offer => [
                  new Date(offer.created_at).toLocaleDateString(),
                  offer.buyer_name || '',
                  offer.buyer_email,
                  offer.offer_amount,
                  offer.status,
                  offer.message?.replace(/,/g, ';') || ''
                ].join(','))
              ].join('\n')
              
              const blob = new Blob([csvContent], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `offers-${new Date().toISOString().split('T')[0]}.csv`
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* 出价列表 */}
      <div className="space-y-4">
        {filteredOffers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No offers match your current filters.</p>
          </div>
        ) : (
          filteredOffers.map((offer) => (
        <div key={offer.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{offer.buyer_name || 'Anonymous'}</h3>
                <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                  {offer.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                  {offer.status === 'accepted' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {offer.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {offer.buyer_email}
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span className="font-semibold text-lg text-gray-900">
                    ${offer.offer_amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {offer.message && (
                <div className="bg-gray-50 p-3 rounded-xl mb-3">
                  <div className="flex items-start">
                    <MessageSquare className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                    <p className="text-sm text-gray-700">{offer.message}</p>
                  </div>
                </div>
              )}

              {/* Payment Status */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Deposit (10%)</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(offer.prepayment_status || 'pending')}`}>
                      <CreditCard className="w-3 h-3 mr-1" />
                      {offer.prepayment_status || 'pending'}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    ${Math.ceil(offer.offer_amount * 0.1).toLocaleString()}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Balance (90%)</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(offer.balance_payment_status || 'pending')}`}>
                      <CreditCard className="w-3 h-3 mr-1" />
                      {offer.balance_payment_status || 'pending'}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    ${(offer.offer_amount - Math.ceil(offer.offer_amount * 0.1)).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Submitted {new Date(offer.created_at).toLocaleString()}
              </div>
            </div>

            {/* Action Buttons - 显示更明显的操作按钮 */}
            <div className="ml-4 min-w-[200px]">
              {offer.status === 'pending' && (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAcceptOffer(offer.id)}
                      disabled={loading === offer.id}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {loading === offer.id ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      接受出价
                    </button>
                    <button
                      onClick={() => handleRejectOffer(offer.id)}
                      disabled={loading === offer.id}
                      className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {loading === offer.id ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      拒绝退款
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    {(offer.prepayment_status || 'pending') === 'succeeded' 
                      ? '✅ 定金已支付，可以操作' 
                      : '⏳ 等待买家支付定金...'}
                  </div>
                </div>
              )}

              {offer.status === 'accepted' && (
                <div className="text-sm text-green-600 font-medium bg-green-50 px-3 py-2 rounded-xl">
                  ✅ 已接受 - 等待尾款支付
                </div>
              )}

              {offer.status === 'rejected' && (
                <div className="text-sm text-red-600 font-medium bg-red-50 px-3 py-2 rounded-xl">
                  ❌ 已拒绝 - 定金已退还
                </div>
              )}
            </div>
          </div>
        </div>
          ))
        )}
      </div>
      
      {/* 显示结果统计 */}
      {filteredOffers.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {filteredOffers.length} of {offers.length} offers
          {stats.avgOffer > 0 && (
            <span className="ml-4">
              Average offer: ${Math.round(stats.avgOffer).toLocaleString()}
            </span>
          )}
        </div>
      )}
    </div>
  )
}