import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, Send, Loader2, CheckCircle, History } from 'lucide-react'
import { stripePromise, calculatePrepaymentAmount } from '../../lib/stripe'
import { supabase } from '../../lib/supabase'
import { useDemoStore } from '../../stores/demoStore'
import { createDepositIntent, confirmPayment } from '../../api/offers'
import toast from 'react-hot-toast'

interface BidWidgetProps {
  formId?: string
  title: string
  price: number
  currency: string
  themeColor?: string
  minBidRatio?: number
  depositPercentage?: number
  allowOptionalMessage?: boolean
  marketPrice?: number
  bidCount?: number
  suggestedBids?: {
    conservative: number
    moderate: number
    aggressive: number
  } | null
}

export const BidWidget: React.FC<BidWidgetProps> = ({
  formId,
  title,
  price,
  currency,
  themeColor = '#7C3AED',
  minBidRatio = 70,
  depositPercentage = 10,
  allowOptionalMessage = true,
  marketPrice,
  bidCount = 0,
  suggestedBids
}) => {
  const { isDemo, addOffer } = useDemoStore()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const minOfferAmount = Math.ceil(price * (minBidRatio / 100))
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    offerAmount: 0, // 用户需要自己填写
    message: ''
  })

  const depositAmount = Math.ceil(formData.offerAmount * (depositPercentage / 100))
  const remainingAmount = formData.offerAmount - depositAmount

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate minimum offer amount
    if (formData.offerAmount < minOfferAmount) {
      toast.error(`Minimum offer is ${currency} ${minOfferAmount.toLocaleString()}`)
      return
    }

    setLoading(true)

    try {
      if (isDemo) {
        // Demo mode - simulate the process
        toast.success('🎯 演示：正在处理您的出价...')
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Add offer to demo store
        addOffer({
          buyerName: formData.buyerName,
          buyerEmail: formData.buyerEmail,
          offerAmount: formData.offerAmount,
          message: formData.message,
          status: 'pending',
          depositStatus: 'pending',
          finalStatus: 'pending'
        })

        toast.success('🎯 演示：模拟支付处理中...')
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        setSuccess(true)
        toast.success(`🎉 Demo: Deposit of ${currency} ${depositAmount.toLocaleString()} paid successfully!`)
        
      } else {
        // Real mode - actual API integration
        if (!formId) {
          throw new Error('Form ID is required')
        }

        const result = await createDepositIntent({
          form_id: formId,
          bid_amount: formData.offerAmount,
          buyer_name: formData.buyerName,
          buyer_email: formData.buyerEmail,
          buyer_message: formData.message,
          agree_terms: true
        })

        if (!result.success) {
          throw new Error(result.error?.message || 'Failed to create offer')
        }

        toast.success('Offer submitted! Processing payment...')
        
        // 模拟支付确认 (在实际应用中，这会通过Stripe处理)
        setTimeout(async () => {
          const paymentIntentId = result.data!.client_secret.split('_secret')[0]
          await confirmPayment(paymentIntentId, 'deposit')
          setSuccess(true)
          toast.success(`🎉 Deposit of ${currency} ${result.data!.deposit_amount.toLocaleString()} paid successfully!`)
        }, 2000)
      }

    } catch (error: any) {
      toast.error(error.message || 'Failed to submit offer')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSuccess(false)
    setIsOpen(false)
    setFormData({
      buyerName: '',
      buyerEmail: '',
      offerAmount: 0, // 重置为0，用户需要自己填写
      message: ''
    })
  }

  // Success state
  if (success) {
    return (
      <div className="bg-white border-2 rounded-3xl p-6 shadow-xl" style={{ borderColor: themeColor }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Offer Submitted Successfully!</h3>
          <p className="text-gray-600 mb-4">
            Your deposit of {currency} {depositAmount.toLocaleString()} has been processed.
          </p>
          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <div className="text-sm text-gray-700">
              <p><strong>Product:</strong> {title}</p>
              <p><strong>Your Offer:</strong> {currency} {formData.offerAmount.toLocaleString()}</p>
              <p><strong>Deposit Paid:</strong> {currency} {depositAmount.toLocaleString()} ({depositPercentage}%)</p>
              <p><strong>Remaining:</strong> {currency} {remainingAmount.toLocaleString()} (due when accepted)</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            The seller will review your offer and respond within 24 hours.
          </p>
          <div className="space-y-3">
            <Link
              to="/buyer-dashboard"
              className="w-full py-3 px-6 rounded-xl font-medium text-white flex items-center justify-center transition-all"
              style={{ backgroundColor: themeColor }}
            >
              <History className="w-4 h-4 mr-2" />
              查看我的出价历史
            </Link>
            <button
              onClick={resetForm}
              className="w-full py-3 px-6 rounded-xl font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all"
            >
              Make Another Offer
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all transform hover:scale-105 shadow-lg"
        style={{ backgroundColor: themeColor }}
      >
        {isDemo ? '🎯 体验演示：立即出价' : 'Make an Offer'}
      </button>
    )
  }

  return (
    <div className="bg-white border-2 rounded-3xl p-6 shadow-xl" style={{ borderColor: themeColor }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          {isDemo ? '🎯 演示模式：提交出价' : 'Make an Offer'}
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div className="mb-4 p-4 bg-gray-50 rounded-2xl">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <div className="flex justify-between items-center mt-2">
          <div>
            <p className="text-gray-600">Market Price</p>
            <p className="font-bold text-lg text-gray-900">
              {currency} {(marketPrice || price).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Current Bids</p>
            <p className="font-bold text-lg text-purple-600">{bidCount}</p>
          </div>
        </div>
      </div>

      {isDemo && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-800">
            🎯 <strong>演示模式：</strong> 这是模拟演示，不会产生真实付款。
          </p>
        </div>
      )}

      <form onSubmit={handleSubmitOffer} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            required
            value={formData.buyerName}
            onChange={(e) => setFormData(prev => ({ ...prev, buyerName: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            required
            value={formData.buyerEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, buyerEmail: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Your Bid Amount
          </label>
          
          {/* 智能出价建议 */}
          {suggestedBids && (
            <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
              <p className="text-sm font-medium text-gray-700 mb-2">💡 智能出价建议</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, offerAmount: suggestedBids.conservative }))}
                  className="p-2 text-xs bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-all"
                >
                  <div className="font-medium">保守</div>
                  <div>{currency} {suggestedBids.conservative.toLocaleString()}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, offerAmount: suggestedBids.moderate }))}
                  className="p-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-all"
                >
                  <div className="font-medium">适中</div>
                  <div>{currency} {suggestedBids.moderate.toLocaleString()}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, offerAmount: suggestedBids.aggressive }))}
                  className="p-2 text-xs bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg transition-all"
                >
                  <div className="font-medium">激进</div>
                  <div>{currency} {suggestedBids.aggressive.toLocaleString()}</div>
                </button>
              </div>
            </div>
          )}
          
          <input
            type="number"
            required
            min={minOfferAmount}
            step="1"
            value={formData.offerAmount || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, offerAmount: parseInt(e.target.value) || 0 }))}
            placeholder={`Minimum bid: ${currency} ${minOfferAmount.toLocaleString()}`}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
          />
          {formData.offerAmount > 0 && formData.offerAmount < minOfferAmount && (
            <p className="text-sm text-red-600 mt-1">
              Minimum bid is {currency} {minOfferAmount.toLocaleString()}
            </p>
          )}
        </div>

        {allowOptionalMessage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Tell the seller about your offer..."
            />
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-xl">
          <div className="flex items-center text-sm text-blue-800">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>
              You'll pay {currency} {depositAmount.toLocaleString()} ({depositPercentage}%) now, 
              and {currency} {remainingAmount.toLocaleString()} ({100 - depositPercentage}%) when accepted.
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.offerAmount || formData.offerAmount < minOfferAmount}
          className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          style={{ backgroundColor: themeColor }}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {isDemo ? 'Simulating...' : 'Processing...'}
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              {formData.offerAmount > 0 
                ? (isDemo ? `🎯 演示：支付 ${currency} ${Math.ceil(formData.offerAmount * (depositPercentage / 100)).toLocaleString()}` : `Submit Bid & Pay ${depositPercentage}%`)
                : 'Enter Your Bid Amount'
              }
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Powered by BidForm.online
      </p>
    </div>
  )
}