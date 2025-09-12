import React, { useEffect } from 'react'
import { BidWidget } from './BidWidget/BidWidget'
import { useDemoStore } from '../stores/demoStore'
import { ArrowLeft, Target, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export const DemoPage: React.FC = () => {
  const { initializeDemo, currentProduct, isDemo } = useDemoStore()

  useEffect(() => {
    initializeDemo()
  }, [initializeDemo])

  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center bg-purple-100 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-purple-700 font-medium text-sm">Demo Mode</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Demo Introduction */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100/80 to-pink-100/80 backdrop-blur-sm rounded-full text-purple-700 text-sm font-semibold mb-6 border border-purple-200/50 shadow-lg">
            <Target className="w-4 h-4 mr-2" />
            🎯 Interactive Demo
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Try BidForm in Action
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the complete buyer journey - from making an offer to paying the deposit. 
            This is a simulation, no real payment will be processed.
          </p>
        </div>

        {/* Product Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Product Display */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6 flex items-center justify-center">
              <div className="text-center">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Product Image</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{currentProduct.title}</h2>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {currentProduct.currency} {currentProduct.price.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Minimum offer: {Math.ceil(currentProduct.price * (currentProduct.minBidRatio / 100)).toLocaleString()} {currentProduct.currency} ({currentProduct.minBidRatio}% of asking price)</li>
                  <li>• Deposit required: {currentProduct.depositPercentage}% of offer amount</li>
                  <li>• Remaining payment due when offer is accepted</li>
                  <li>• Seller responds within 24 hours</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Make your offer (minimum {currentProduct.minBidRatio}% of asking price)</li>
                  <li>2. Pay {currentProduct.depositPercentage}% deposit to secure your offer</li>
                  <li>3. Seller reviews and accepts/rejects your offer</li>
                  <li>4. If accepted, pay remaining amount to complete purchase</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Bid Widget */}
          <div className="sticky top-24">
            <BidWidget
              formId="demo-form"
              title={currentProduct.title}
              price={currentProduct.price}
              currency={currentProduct.currency}
              minBidRatio={currentProduct.minBidRatio}
              depositPercentage={currentProduct.depositPercentage}
              allowOptionalMessage={currentProduct.allowOptionalMessage}
              themeColor="#7C3AED"
            />
            
            {isDemo && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-800">
                  <strong>💡 Demo Tip:</strong> Try different offer amounts to see how the deposit calculation changes. 
                  The form validates minimum offers and simulates the complete payment flow.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Highlight */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Smart Validation",
              description: "Automatically validates minimum offer amounts and calculates deposits",
              icon: "🎯"
            },
            {
              title: "Secure Payments", 
              description: "Split payment flow with deposit first, balance on acceptance",
              icon: "🔒"
            },
            {
              title: "Real-time Updates",
              description: "Instant notifications and status updates throughout the process",
              icon: "⚡"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}