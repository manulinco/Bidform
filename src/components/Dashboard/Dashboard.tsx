import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useMerchantStore } from '../../stores/merchantStore'
import { BidFormsList } from './BidFormsList'
import { OffersList } from './OffersList'
import { CreateBidFormModal } from './CreateBidFormModal'
import { Plus, DollarSign, TrendingUp, Users, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuthStore()
  const { 
    merchant, 
    bidForms, 
    offers, 
    loading,
    createMerchant, 
    fetchMerchant, 
    fetchBidForms, 
    fetchOffers 
  } = useMerchantStore()
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'forms' | 'offers'>('forms')

  useEffect(() => {
    if (user) {
      initializeMerchant()
    }
  }, [user])

  const initializeMerchant = async () => {
    if (!user) return

    try {
      await fetchMerchant(user.id)
      
      // If no merchant exists, create one
      if (!merchant) {
        await createMerchant(user.id, user.user_metadata?.full_name || user.email?.split('@')[0])
      }
    } catch (error: any) {
      toast.error('Failed to initialize merchant account')
    }
  }

  useEffect(() => {
    if (merchant) {
      fetchBidForms(merchant.id)
      fetchOffers(merchant.id)
    }
  }, [merchant])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
    } catch (error: any) {
      toast.error('Failed to sign out')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Active Forms',
      value: bidForms.filter(form => form.is_active).length,
      icon: DollarSign,
      color: 'text-green-600 bg-green-100'
    },
    {
      name: 'Total Offers',
      value: offers.length,
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      name: 'Pending Offers',
      value: offers.filter(offer => offer.status === 'pending').length,
      icon: Users,
      color: 'text-orange-600 bg-orange-100'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">BidForm</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {merchant?.business_name || user?.user_metadata?.full_name || 'there'}!
          </h1>
          <p className="text-gray-600">
            Manage your bid forms and track offers from your dashboard.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('forms')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'forms'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Bid Forms ({bidForms.length})
              </button>
              <button
                onClick={() => setActiveTab('offers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'offers'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Offers ({offers.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'forms' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Your Bid Forms</h2>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-medium transition-all flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Form
                  </button>
                </div>
                <BidFormsList forms={bidForms} />
              </div>
            )}

            {activeTab === 'offers' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Offers</h2>
                <OffersList offers={offers} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && merchant && (
        <CreateBidFormModal
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          merchantId={merchant.id}
        />
      )}
    </div>
  )
}