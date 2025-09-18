import React from 'react'
import { ArrowRight, Zap, Share2, Code, ExternalLink } from 'lucide-react'

interface QuickStartGuideProps {
  onNavigateToGenerator: () => void
}

export const QuickStartGuide: React.FC<QuickStartGuideProps> = ({ onNavigateToGenerator }) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          🎉 Welcome to BidForm!
        </h3>
        <p className="text-gray-600 text-lg">
          Generate bid links for your products in 30 seconds and start receiving offers
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Share2 className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">1. Generate Product Link</h4>
          <p className="text-sm text-gray-600">Select product and generate dedicated bid page link with one click</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ExternalLink className="w-6 h-6 text-pink-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">2. Share to Social Platforms</h4>
          <p className="text-sm text-gray-600">WeChat, Weibo, Moments - share to potential buyers with one click</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Code className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">3. Embed in Existing Website</h4>
          <p className="text-sm text-gray-600">Copy code and embed into any website or store</p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onNavigateToGenerator}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all flex items-center mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Start Generating Links Now
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
        <p className="text-sm text-gray-500 mt-3">
          We've prepared demo products for you, click to start experiencing
        </p>
      </div>
    </div>
  )
}