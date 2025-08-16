import React from 'react'
import { Database } from '../../lib/supabase'
import { useMerchantStore } from '../../stores/merchantStore'
import { Check, X, Clock, DollarSign, Mail, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

type Offer = Database['public']['Tables']['offers']['Row']

interface OffersListProps {
  offers: Offer[]
}

export const OffersList: React.FC<OffersListProps> = ({ offers }) => {
  const { updateOfferStatus } = useMerchantStore()

  const handleAcceptOffer = async (offerId: string) => {
    try {
      await updateOfferStatus(offerId, 'accepted')
      toast.success('Offer accepted! Buyer will be notified to complete payment.')
    } catch (error: any) {
      toast.error('Failed to accept offer')
    }
  }

  const handleRejectOffer = async (offerId: string) => {
    try {
      await updateOfferStatus(offerId, 'rejected')
      toast.success('Offer rejected')
    } catch (error: any) {
      toast.error('Failed to reject offer')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'expired':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3" />
      case 'accepted':
        return <Check className="w-3 h-3" />
      case 'rejected':
        return <X className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No offers yet</h3>
        <p className="text-gray-600">Offers will appear here when buyers submit them through your bid forms.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {offers.map((offer) => (
        <div key={offer.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-900">
                    {offer.buyer_name || offer.buyer_email}
                  </span>
                </div>
                <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                  {getStatusIcon(offer.status)}
                  <span className="ml-1 capitalize">{offer.status}</span>
                </span>
              </div>

              <div className="flex items-center mb-3">
                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">
                  ${offer.offer_amount.toLocaleString()}
                </span>
              </div>

              {offer.message && (
                <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-700">{offer.message}</p>
                </div>
              )}

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Submitted {new Date(offer.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span>Prepayment: {offer.prepayment_status}</span>
                {offer.balance_payment_status !== 'pending' && (
                  <>
                    <span>•</span>
                    <span>Balance: {offer.balance_payment_status}</span>
                  </>
                )}
              </div>
            </div>

            {offer.status === 'pending' && (
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleAcceptOffer(offer.id)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accept
                </button>
                <button
                  onClick={() => handleRejectOffer(offer.id)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}