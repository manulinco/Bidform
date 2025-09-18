import React, { useEffect, useState } from 'react'
import { Users, DollarSign, TrendingUp, Plus, Settings, LogOut, Home, FileText, MessageSquare, Zap, History } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useMerchantStore } from '../../stores/merchantStore'
import { BidFormsList } from './BidFormsList'
import { CreateProductModal } from './CreateProductModal'
import { OffersList } from './OffersList'
import { ProductLinkGenerator } from './ProductLinkGenerator'

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuthStore()
  const { merchant, bidForms, offers, stats, loading, initialize } = useMerchantStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'forms' | 'offers' | 'generator'>('generator')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Get user display name
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'

  useEffect(() => {
    if (user?.id) {
      initialize(user.id)
    }
  }, [user?.id, initialize])

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">BidForm</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium text-gray-900">{userName}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Home className="w-5 h-5 mr-3" />
                  Overview
                </button>
                
                <button
                  onClick={() => setActiveTab('generator')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors ${
                    activeTab === 'generator'
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Zap className="w-5 h-5 mr-3" />
                  💫 Earn the Choice Creator
                  <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    NEW
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('forms')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors ${
                    activeTab === 'forms'
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-5 h-5 mr-3" />
                  My Products
                  {bidForms.length > 0 && (
                    <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {bidForms.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('offers')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors ${
                    activeTab === 'offers'
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  Received Offers
                  {offers.length > 0 && (
                    <span className="ml-auto bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                      {offers.length}
                    </span>
                  )}
                </button>

                <Link
                  to="/my-bids"
                  className="w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors text-gray-600 hover:bg-gray-100"
                >
                  <History className="w-5 h-5 mr-3" />
                  My Bid History
                  <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    NEW
                  </span>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Products</span>
                    <span className="font-medium text-gray-900">{bidForms.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Offers</span>
                    <span className="font-medium text-gray-900">{stats.totalOffers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Successful Deals</span>
                    <span className="font-medium text-gray-900">{stats.acceptedOffers}</span>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">
                      Welcome to Earn the Choice! 💫
                    </h1>
                    <p className="text-purple-100 text-lg mb-6">
                      Where authentic words unlock extra worth - your story matters more than numbers
                    </p>
                    <button
                      onClick={() => setActiveTab('generator')}
                      className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      Activate Your Destiny Power
                      <span className="text-xl ml-2">✨</span>
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Products</p>
                        <p className="text-2xl font-bold text-gray-900">{bidForms.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Offers</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalOffers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Successful Deals</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.acceptedOffers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                        <span className="text-yellow-600 font-bold">$</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    🚀 Get Started in 3 Steps
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-3">1. Create Product</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Add your product details, set pricing, and customize deposit percentage
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-pink-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-3">2. Generate Link</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Create shareable links and embed codes for social media and websites
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <DollarSign className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-3">3. Receive Offers</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Accept or decline offers with automatic deposit and payment processing
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'generator' && (
              <ProductLinkGenerator />
            )}

            {activeTab === 'forms' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
                    <p className="text-gray-600">Manage your bidding products</p>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center font-medium"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Product
                  </button>
                </div>
                <BidFormsList forms={bidForms} />
              </div>
            )}

            {activeTab === 'offers' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Received Offers</h2>
                  <p className="text-gray-600">View and manage buyer offers</p>
                </div>
                <OffersList offers={offers} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Product Modal */}
      {showCreateModal && (
        <CreateProductModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}