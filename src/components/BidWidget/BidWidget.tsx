import React, { useState } from 'react'
import { DollarSign, Send, Loader2 } from 'lucide-react'
import { stripePromise, calculatePrepaymentAmount } from '../../lib/stripe'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface BidWidgetProps {
  formId: string
  title: string
  price: number
  currency: string
  themeColor?: string
}

export const BidWidget: React.FC<BidWidgetProps> = ({
  formId,
  title,
  price,
  currency,
  themeColor = '#7C3AED'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    offerAmount: price,
    message: ''
  })

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Calculate prepayment amount (10%)
      const prepaymentAmount = calculatePrepaymentAmount(formData.offerAmount)

      // Create offer record
      const { data: offer, error: offerError } = await supabase
        .from('offers')
        .insert({
          form_id: formId,
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

      // Create Stripe payment intent for prepayment
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

      // Redirect to Stripe Checkout or handle payment
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to load')

      // For MVP, we'll use confirmPayment with a simple form
      // In production, you'd want to use Stripe Elements or Checkout
      toast.success('Offer submitted! Redirecting to payment...')
      
      // Store payment intent ID
      await supabase
        .from('offers')
        .update({ prepayment_intent_id: clientSecret.split('_secret')[0] })
        .eq('id', offer.id)

      // For MVP demo, we'll simulate successful payment
      setTimeout(() => {
        toast.success('Payment successful! Merchant will be notified.')
        setIsOpen(false)
        setFormData({
          buyerName: '',
          buyerEmail: '',
          offerAmount: price,
          message: ''
        })
      }, 2000)

    } catch (error: any) {
      toast.error(error.message || 'Failed to submit offer')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all transform hover:scale-105 shadow-lg"
        style={{ backgroundColor: themeColor }}
      >
        Make an Offer
      </button>
    )
  }

  return (
    <div className="bg-white border-2 rounded-3xl p-6 shadow-xl" style={{ borderColor: themeColor }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Make an Offer</h3>
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
      </div>

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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all"
            style={{ focusRingColor: themeColor }}
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all"
            style={{ focusRingColor: themeColor }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Offer ({currency})
          </label>
          <input
            type="number"
            required
            min="1"
            step="0.01"
            value={formData.offerAmount}
            onChange={(e) => setFormData(prev => ({ ...prev, offerAmount: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all"
            style={{ focusRingColor: themeColor }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message (Optional)
          </label>
          <textarea
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all resize-none"
            style={{ focusRingColor: themeColor }}
            placeholder="Tell the seller about your offer..."
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-xl">
          <div className="flex items-center text-sm text-blue-800">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>
              You'll pay {currency} {calculatePrepaymentAmount(formData.offerAmount).toLocaleString()} (10%) now, 
              and {currency} {(formData.offerAmount - calculatePrepaymentAmount(formData.offerAmount)).toLocaleString()} (90%) when accepted.
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          style={{ backgroundColor: themeColor }}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Submit Offer & Pay 10%
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