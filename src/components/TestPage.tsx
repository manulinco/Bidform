import React from 'react'
import { BidWidget } from './BidWidget/BidWidget'

export const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            BidForm Widget Demo
          </h1>
          <p className="text-xl text-gray-600">
            Test the bid widget functionality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Sample Product 1 */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="mb-6">
              <div className="w-full h-48 bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl mb-4 flex items-center justify-center">
                <span className="text-gray-600 font-medium">Vintage Watch</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Vintage Rolex Submariner</h3>
              <p className="text-gray-600 mb-4">
                Classic 1970s Rolex Submariner in excellent condition. 
                Comes with original box and papers.
              </p>
            </div>
            <BidWidget
              formId="demo-1"
              title="Vintage Rolex Submariner"
              price={15000}
              currency="USD"
              themeColor="#7C3AED"
            />
          </div>

          {/* Sample Product 2 */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="mb-6">
              <div className="w-full h-48 bg-gradient-to-br from-blue-200 to-green-200 rounded-2xl mb-4 flex items-center justify-center">
                <span className="text-gray-600 font-medium">Artwork</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Original Oil Painting</h3>
              <p className="text-gray-600 mb-4">
                Beautiful landscape painting by local artist. 
                Perfect for modern home decoration.
              </p>
            </div>
            <BidWidget
              formId="demo-2"
              title="Original Oil Painting"
              price={2500}
              currency="USD"
              themeColor="#059669"
            />
          </div>

          {/* Sample Product 3 */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="mb-6">
              <div className="w-full h-48 bg-gradient-to-br from-orange-200 to-red-200 rounded-2xl mb-4 flex items-center justify-center">
                <span className="text-gray-600 font-medium">Collectible</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rare Baseball Card</h3>
              <p className="text-gray-600 mb-4">
                1952 Mickey Mantle rookie card in mint condition. 
                Authenticated and graded.
              </p>
            </div>
            <BidWidget
              formId="demo-3"
              title="1952 Mickey Mantle Card"
              price={50000}
              currency="USD"
              themeColor="#DC2626"
            />
          </div>
        </div>

        <div className="mt-12 bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Make an Offer</h3>
              <p className="text-gray-600 text-sm">
                Click "Make an Offer" and fill in your details and bid amount.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pay 10% Deposit</h3>
              <p className="text-gray-600 text-sm">
                Secure your offer with a 10% deposit payment via Stripe.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Complete Purchase</h3>
              <p className="text-gray-600 text-sm">
                When accepted, pay the remaining 90% to complete the purchase.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            This is a demo environment. No real payments will be processed.
          </p>
        </div>
      </div>
    </div>
  )
}