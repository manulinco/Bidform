import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMerchantStore } from '../../stores/merchantStore'
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Mail,
  MessageSquare,
  Receipt,
  Download,
  RefreshCw
} from 'lucide-react'

export const TransactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { offers } = useMerchantStore()
  
  // 根据ID查找对应的交易信息
  const transaction = offers.find(offer => offer.id === id)
  
  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Transaction Not Found</h2>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find the transaction information you're looking for.</p>
          <button
            onClick={() => navigate('/buyer-dashboard')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to My Bids
          </button>
        </div>
      </div>
    )
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：交易详情 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 交易概览 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
                  {transaction.status === 'pending' && <Clock className="w-4 h-4 mr-1" />}
                  {transaction.status === 'accepted' && <CheckCircle className="w-4 h-4 mr-1" />}
                  {transaction.status === 'rejected' && <XCircle className="w-4 h-4 mr-1" />}
                  {transaction.status === 'pending' ? 'Pending Reply' :
                   transaction.status === 'accepted' ? 'Accepted' : 'Rejected'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                  <p className="font-mono text-gray-900">{transaction.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Created At</p>
                  <p className="text-gray-900">{new Date(transaction.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Product ID</p>
                  <p className="font-mono text-gray-900">{transaction.form_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bid Amount</p>
                  <p className="text-2xl font-bold text-purple-600">¥{transaction.offer_amount.toLocaleString()}</p>
                </div>
              </div>

              {/* 产品信息 */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Receipt className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{transaction.title}</h4>
                    <p className="text-sm text-gray-600">{transaction.description || 'No description available'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 买家信息 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Buyer Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{transaction.buyer_name || 'Anonymous User'}</p>
                    <p className="text-sm text-gray-600">Buyer Name</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{transaction.buyer_email}</p>
                    <p className="text-sm text-gray-600">Contact Email</p>
                  </div>
                </div>

                {transaction.message && (
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900 mb-1">Buyer Message</p>
                        <p className="text-blue-800">{transaction.message}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 交易时间线 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Timeline</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Bid Submitted</p>
                    <p className="text-sm text-gray-600">{new Date(transaction.created_at).toLocaleString()}</p>
                  </div>
                </div>

                {(transaction.prepayment_status || 'pending') === 'succeeded' && (
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Deposit Payment Successful</p>
                      <p className="text-sm text-gray-600">¥{Math.ceil(transaction.offer_amount * 0.1).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {transaction.status === 'accepted' && (
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Bid Accepted</p>
                      <p className="text-sm text-gray-600">Merchant has accepted your bid</p>
                    </div>
                  </div>
                )}

                {transaction.status === 'pending' && (
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Waiting for Merchant Reply</p>
                      <p className="text-sm text-gray-600">Your bid is under review</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：支付信息 */}
          <div className="space-y-6">
            {/* 支付详情 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
              
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Deposit (10%)</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(transaction.prepayment_status || 'pending')}`}>
                      <CreditCard className="w-3 h-3 mr-1" />
                      {(transaction.prepayment_status || 'pending') === 'succeeded' ? 'Paid' :
                       (transaction.prepayment_status || 'pending') === 'pending' ? 'Pending' : 'Failed'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">¥{Math.ceil(transaction.offer_amount * 0.1).toLocaleString()}</p>
                  {transaction.prepayment_intent_id && (
                    <p className="text-xs text-gray-500 mt-1 font-mono">ID: {transaction.prepayment_intent_id}</p>
                  )}
                </div>

                <div className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Balance (90%)</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(transaction.balance_payment_status || 'pending')}`}>
                      <CreditCard className="w-3 h-3 mr-1" />
                      {(transaction.balance_payment_status || 'pending') === 'succeeded' ? 'Paid' :
                       (transaction.balance_payment_status || 'pending') === 'pending' ? 'Pending' : 'Failed'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">¥{(transaction.offer_amount - Math.ceil(transaction.offer_amount * 0.1)).toLocaleString()}</p>
                  {transaction.balance_payment_intent_id && (
                    <p className="text-xs text-gray-500 mt-1 font-mono">ID: {transaction.balance_payment_intent_id}</p>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-purple-600">¥{transaction.offer_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="space-y-3">
                {transaction.status === 'accepted' && (transaction.balance_payment_status || 'pending') === 'pending' && (
                  <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                    Pay Balance
                  </button>
                )}
                
                {(transaction.prepayment_status || 'pending') === 'pending' && (
                  <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                    Pay Deposit
                  </button>
                )}
                
                <button
                  onClick={() => navigate(`/product/${transaction.form_id}`)}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  查看产品详情
                </button>
                
                <button
                  onClick={() => navigate('/buyer-dashboard')}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  返回我的出价
                </button>
              </div>
            </div>

            {/* 帮助信息 */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">需要帮助？</h4>
              <p className="text-sm text-blue-800 mb-3">
                如果您对交易有任何疑问，请联系我们的客服团队。
              </p>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                联系客服 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}