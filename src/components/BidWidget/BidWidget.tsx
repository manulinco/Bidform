import React, { useState } from 'react'
import { DollarSign, Send, Loader2, CheckCircle } from 'lucide-react'
import { stripePromise, calculatePrepaymentAmount } from '../../lib/stripe'
import { supabase } from '../../lib/supabase'
import { useDemoStore } from '../../stores/demoStore'
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
}

export const BidWidget: React.FC<BidWidgetProps> = ({
  formId,
  title,
  price,
  currency,
  themeColor = '#7C3AED',
  minBidRatio = 70,
  depositPercentage = 10,
  allowOptionalMessage = true
}) => {
  const { isDemo, addOffer } = useDemoStore()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const minOfferAmount = Math.ceil(price * (minBidRatio / 100))
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    offerAmount: minOfferAmount,
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
        toast.success('🎯 Demo: Processing your offer...')
        
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

        toast.success('🎯 Demo: Simulating payment processing...')
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        setSuccess(true)
        toast.success(`🎉 Demo: Deposit of ${currency} ${depositAmount.toLocaleString()} paid successfully!`)
        
      } else {
        // Real mode - actual Supabase and Stripe integration
        if (!supabase) {
          throw new Error('Database not available')
        }
        
        const prepaymentAmount = calculatePrepaymentAmount(formData.offerAmount)

        const { data: offer, error: offerError } = await supabase
          .from('offers')
          .insert({
            form_id: formId!,
            buyer_email: formData.buyerEmail,
            buyer_name: formData.buyerName,
            offer_amount: formData.offerAmount,
            message: formData.message,
            status: 'pending',
            prepayment_status: 'pending',
            balance_payment_status: 'pending'
          })
          .select()
          .single()

        if (offerError) throw offerError

        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: prepaymentAmount,
            currency: currency.toLowerCase(),
            offerId: offer.id,
            type: 'prepayment'
          }),
        })

        const { clientSecret, error: paymentError } = await response.json()
        
        if (paymentError) throw new Error(paymentError)

        const stripe = await stripePromise
        if (!stripe) throw new Error('Stripe failed to load')

        toast.success('Offer submitted! Redirecting to payment...')
        
        await supabase
          .from('offers')
          .update({ prepayment_intent_id: clientSecret.split('_secret')[0] })
          .eq('id', offer.id)
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
      offerAmount: minOfferAmount,
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
          <button
            onClick={resetForm}
            className="w-full py-3 px-6 rounded-xl font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all"
          >
            Make Another Offer
          </button>
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
        {isDemo ? '🎯 Try Demo: Make an Offer' : 'Make an Offer'}
      </button>
    )
  }

  return (
    <div className="bg-white border-2 rounded-3xl p-6 shadow-xl" style={{ borderColor: themeColor }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          {isDemo ? '🎯 Demo: Make an Offer' : 'Make an Offer'}
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
        <p className="text-gray-600">Starting at {currency} {price.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-1">
          Minimum offer: {currency} {minOfferAmount.toLocaleString()} ({minBidRatio}% of asking price)
        </p>
      </div>

      {isDemo && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-800">
            🎯 <strong>Demo Mode:</strong> This is a simulation. No real payment will be processed.
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
            Your Offer ({currency})
          </label>
          <input
            type="number"
            required
            min={minOfferAmount}
            step="1"
            value={formData.offerAmount}
            onChange={(e) => setFormData(prev => ({ ...prev, offerAmount: parseInt(e.target.value) || minOfferAmount }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          />
          {formData.offerAmount < minOfferAmount && (
            <p className="text-sm text-red-600 mt-1">
              Minimum offer is {currency} {minOfferAmount.toLocaleString()}
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
          disabled={loading || formData.offerAmount < minOfferAmount}
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
              {isDemo ? `🎯 Demo: Pay ${currency} ${depositAmount.toLocaleString()}` : `Submit Offer & Pay ${depositPercentage}%`}
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