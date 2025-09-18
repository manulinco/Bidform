import React, { useState } from 'react'
import { Clock, TrendingUp, Users, Shield } from 'lucide-react'

interface ShareCardProps {
  title: string
  brand: string
  image: string
  currency: string
  startingPrice: number
  currentHighest: number
  timeLeft: string
  totalOffers: number
  theme: string
  formId: string
}

function currencySymbol(cur: string): string {
  const symbols: Record<string, string> = {
    USD: '$', EUR: '€', CNY: '¥', JPY: '¥', GBP: '£'
  }
  return symbols[cur.toUpperCase()] || '$'
}

export const ShareCardGenerator: React.FC<ShareCardProps> = ({
  title,
  brand,
  image,
  currency,
  startingPrice,
  currentHighest,
  timeLeft,
  totalOffers,
  theme,
  formId
}) => {
  const [isGenerating, setIsGenerating] = useState(false)
  
  const symbol = currencySymbol(currency)

  const generateShareLink = async () => {
    setIsGenerating(true)
    try {
      const shareUrl = `${window.location.origin}/share/${formId}?title=${encodeURIComponent(title)}&brand=${encodeURIComponent(brand)}&img=${encodeURIComponent(image)}&currency=${currency}&start=${startingPrice}&highest=${currentHighest}&time=${encodeURIComponent(timeLeft)}&offers=${totalOffers}&theme=${encodeURIComponent(theme)}`
      
      await navigator.clipboard.writeText(shareUrl)
      alert('🎯 高转化分享链接已复制到剪贴板！\n\n用户点击后将看到专业的出价页面，大幅提升转化率。')
    } catch (error) {
      console.error('生成分享链接失败:', error)
      alert('复制失败，请手动复制链接')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 分享卡片预览 */}
      <div 
        className="w-full max-w-2xl mx-auto bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
        style={{ aspectRatio: '1200/630' }}
      >
        <div className="grid grid-cols-2 h-full">
          {/* 左侧图片 */}
          <div className="relative">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40"></div>
            
            {/* 品牌标签 */}
            <div className="absolute top-4 left-4">
              <div className="bg-white/95 text-gray-900 px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                {brand}
              </div>
            </div>

            {/* 紧迫感标签 */}
            <div className="absolute top-4 right-4">
              <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold animate-pulse shadow-lg">
                🔥 限时竞拍
              </div>
            </div>

            {/* 统计信息 */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{totalOffers} 次出价</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>剩余 {timeLeft}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">平台担保</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧信息 */}
          <div className="p-6 flex flex-col justify-between text-white">
            {/* 标题区域 */}
            <div>
              <h1 className="text-xl font-bold mb-3 leading-tight line-clamp-2">
                {title}
              </h1>
              
              {/* 价格信息 */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="bg-gray-800/60 rounded-lg px-2 py-1">
                    <span className="text-gray-400 text-xs">市场价</span>
                    <div className="text-white font-bold">
                      {symbol}{Math.ceil(startingPrice * 1.2).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-red-500/20 border border-red-500/40 rounded-lg px-2 py-1">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-red-400" />
                      <span className="text-red-400 font-bold text-xs">出价次数</span>
                    </div>
                    <div className="text-red-300 font-bold">
                      {totalOffers}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA 区域 */}
            <div className="space-y-3">
              {/* 输入提示 */}
              <div className="bg-white/10 border border-white/20 rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-white font-bold">{symbol}</span>
                  <span>Add a note to earn the choice</span>
                </div>
              </div>

              {/* 主要按钮 */}
              <button
                className="w-full py-3 rounded-lg text-white font-bold text-sm transition-all shadow-lg hover:shadow-xl relative overflow-hidden"
                style={{ backgroundColor: theme }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">
                  ✨ Activate Your Destiny Power
                </span>
              </button>

              {/* 信任信号 */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-400" />
                  <span>平台担保交易</span>
                </div>
                <span>BidForm</span>
              </div>

              {/* 引导文案 */}
              <div className="text-xs text-gray-300 text-center bg-white/5 rounded-lg py-2">
                💫 Your words unlock extra worth
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={generateShareLink}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
        >
          {isGenerating ? 'Creating Choice Link...' : '✨ Copy Destiny Link'}
        </button>
        
        <button
          onClick={() => {
            const shareUrl = `${window.location.origin}/share/${formId}?title=${encodeURIComponent(title)}&brand=${encodeURIComponent(brand)}&img=${encodeURIComponent(image)}&currency=${currency}&start=${startingPrice}&highest=${currentHighest}&time=${encodeURIComponent(timeLeft)}&offers=${totalOffers}&theme=${encodeURIComponent(theme)}`
            window.open(shareUrl, '_blank')
          }}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
        >
          👀 Preview Choice Page
        </button>
      </div>

      {/* 使用说明 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-lg">✨</span>
          Earn the Choice System Guide
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">1.</span>
              <span>Copy your destiny link to open choice opportunities</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">2.</span>
              <span>Buyers express their story beyond just numbers</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">3.</span>
              <span>The right words can earn the choice over higher bids</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">4.</span>
              <span>Share across platforms with one click</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white/60 rounded-lg border border-purple-200">
          <div className="text-xs text-gray-600">
            <strong className="text-purple-700">Earn the Choice Features:</strong>
            Personal Stories • Value Expression • Trust Building • Authentic Connection • Destiny Power • Choice Earning
          </div>
        </div>
      </div>
    </div>
  )
}