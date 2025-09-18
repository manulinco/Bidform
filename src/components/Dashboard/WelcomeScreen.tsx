import React from 'react'
import { ArrowRight, Zap, Share2, Code, ExternalLink, Sparkles } from 'lucide-react'

interface WelcomeScreenProps {
  onNavigateToGenerator: () => void
  userName: string
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigateToGenerator, userName }) => {
  return (
    <div className="space-y-8">
      {/* 欢迎横幅 */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <Sparkles className="w-8 h-8 mr-3" />
            <span className="text-lg font-semibold">欢迎使用 BidForm！</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            你好，{userName}！🎉
          </h1>
          <p className="text-purple-100 text-lg mb-6">
            我们已经为你准备了演示产品，30秒内即可生成出价链接并开始接收出价
          </p>
          <button
            onClick={onNavigateToGenerator}
            className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            立即生成产品链接
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>

      {/* 功能介绍 */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          🚀 三步开始接收出价
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">1. 生成产品链接</h4>
            <p className="text-gray-600 leading-relaxed">
              选择你的产品，一键生成专属的出价页面链接，包含完整的产品信息和出价功能
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-pink-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">2. 分享到社交平台</h4>
            <p className="text-gray-600 leading-relaxed">
              微信朋友圈、微博、QQ空间，一键分享给潜在买家，让更多人看到你的产品
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">3. 嵌入现有网站</h4>
            <p className="text-gray-600 leading-relaxed">
              复制嵌入代码，轻松集成到你的网站、商城或博客，无需技术背景
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
          <div className="flex items-start">
            <Zap className="w-6 h-6 text-blue-600 mr-3 mt-1" />
            <div>
              <h5 className="font-semibold text-blue-900 mb-2">💡 演示模式说明</h5>
              <p className="text-blue-800 text-sm leading-relaxed">
                当前为演示模式，我们已经为你创建了3个示例产品（古董腕表、艺术画作、经典跑车）。
                你可以立即体验完整的链接生成和分享功能，无需任何配置。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}