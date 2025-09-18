import React from 'react'
import { ArrowRight, Zap, Share2, Code, ExternalLink, Sparkles } from 'lucide-react'

interface WelcomeScreenProps {
  onNavigateToGenerator: () => void
  userName: string
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigateToGenerator, userName }) => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <Sparkles className="w-8 h-8 mr-3" />
            <span className="text-lg font-semibold">Welcome to BidForm!</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Hello, {userName}! 🎉
          </h1>
          <p className="text-purple-100 text-lg mb-6">
            We've prepared demo products for you. Generate bid links and start receiving offers in 30 seconds
          </p>
          <button
            onClick={onNavigateToGenerator}
            className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Generate Product Link Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>

      {/* Feature Introduction */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          🚀 Start Receiving Bids in 3 Steps
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">1. Generate Product Link</h4>
            <p className="text-gray-600 leading-relaxed">
              Select your product and generate a dedicated bid page link with complete product information and bidding functionality
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-pink-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">2. Share to Social Platforms</h4>
            <p className="text-gray-600 leading-relaxed">
              WeChat Moments, Weibo, QQ Space - share with one click to potential buyers and reach more people
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">3. Embed in Existing Website</h4>
            <p className="text-gray-600 leading-relaxed">
              Copy embed code and easily integrate into your website, store, or blog - no technical background required
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
          <div className="flex items-start">
            <Zap className="w-6 h-6 text-blue-600 mr-3 mt-1" />
            <div>
              <h5 className="font-semibold text-blue-900 mb-2">💡 Demo Mode Instructions</h5>
              <p className="text-blue-800 text-sm leading-relaxed">
                Currently in demo mode. We've created 3 sample products for you (vintage watch, art painting, classic car).
                You can immediately experience the complete link generation and sharing features without any configuration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}