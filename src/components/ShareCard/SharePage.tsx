import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Clock, Shield, TrendingUp, Users, History, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { useMerchantStore } from '../../stores/merchantStore'
import { BidForm } from '../../types'

interface SharePageData {
  title: string
  brand: string
  image: string
  currency: string
  marketPrice: number
  currentBids: number
  suggestedMin: number
  suggestedMax: number
  timeLeft: string
  totalOffers: number
  theme: string
  buttonText: string
  description?: string
  minimumBidRatio: number
}

function currencySymbol(cur: string): string {
  const symbols: Record<string, string> = {
    USD: '$', EUR: '€', CNY: '¥', JPY: '¥', GBP: '£'
  }
  return symbols[cur.toUpperCase()] || '¥'
}

export const SharePage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>()
  const navigate = useNavigate()
  const { bidForms, offers, initialize } = useMerchantStore()
  const [offer, setOffer] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [productData, setProductData] = useState<BidForm | null>(null)
  const [showSuggestion, setShowSuggestion] = useState(false)

  useEffect(() => {
    // 获取产品数据
    const loadProductData = async () => {
      try {
        await initialize('demo-user-123')
      } catch (error) {
        console.error('Failed to load product data:', error)
      }
    }
    loadProductData()
  }, [initialize])

  useEffect(() => {
    // 查找对应的产品
    if (formId && bidForms.length > 0) {
      const product = bidForms.find(form => form.id === formId)
      setProductData(product || null)
    }
  }, [formId, bidForms])

  // 如果产品不存在，显示错误页面
  if (!productData && bidForms.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">产品未找到</h2>
          <p className="text-gray-600 mb-6">抱歉，您访问的出价表单不存在或已下线。</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            ← 返回首页
          </button>
        </div>
      </div>
    )
  }

  // 如果还在加载中
  if (!productData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载产品信息中...</p>
        </div>
      </div>
    )
  }

  // 计算相关数据
  const productOffers = offers.filter(o => o.form_id === formId)
  const marketPrice = productData.starting_price || 0
  const minimumBidRatio = (productData.minimum_bid_ratio || 70) / 100
  const suggestedMin = Math.ceil(marketPrice * minimumBidRatio)
  const suggestedMax = Math.ceil(marketPrice * 1.2) // 建议最高价为市场价的120%

  const config: SharePageData = {
    title: productData.title,
    brand: 'Premium Brand',
    image: productData.image_url || 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?q=80&w=1200&auto=format&fit=crop',
    currency: productData.currency || 'CNY',
    marketPrice: marketPrice,
    currentBids: productOffers.length,
    suggestedMin: suggestedMin,
    suggestedMax: suggestedMax,
    timeLeft: '2天 14小时',
    totalOffers: productOffers.length,
    theme: productData.theme_color || '#DC2626',
    buttonText: '立即出价 🔥',
    description: productData.description,
    minimumBidRatio: productData.minimum_bid_ratio || 70
  }

  const symbol = currencySymbol(config.currency)

  const handleOfferChange = (value: string) => {
    setOffer(value)
    const numValue = parseFloat(value)
    if (numValue && numValue < suggestedMin) {
      setShowSuggestion(true)
    } else {
      setShowSuggestion(false)
    }
  }

  const handleSubmit = async () => {
    if (!offer || parseFloat(offer) < suggestedMin) {
      alert(`出价不能低于建议最低价 ${symbol}${suggestedMin.toLocaleString()}`)
      return
    }

    setLoading(true)
    try {
      // 这里应该调用提交出价的API
      await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
      alert('出价提交成功！')
      navigate('/buyer-dashboard')
    } catch (error) {
      alert('出价提交失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* 左侧：产品图片 */}
          <div className="relative">
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                {config.brand}
              </span>
            </div>
            <div className="absolute top-4 right-4 z-10">
              <span 
                className="text-white px-3 py-1 rounded-full text-sm font-bold"
                style={{ backgroundColor: config.theme }}
              >
                {config.buttonText.replace('🔥', '').trim()}
              </span>
            </div>
            <img
              src={config.image}
              alt={config.title}
              className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
            />
          </div>

          {/* 右侧：产品信息和出价 */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">{config.title}</h1>
              {config.description && (
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {config.description}
                </p>
              )}
            </div>

            {/* 价格信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-gray-300 text-sm mb-1">市场价</div>
                <div className="text-2xl font-bold">{symbol}{config.marketPrice.toLocaleString()}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-gray-300 text-sm mb-1">出价次数</div>
                <div className="text-2xl font-bold text-red-400">📈 {config.currentBids}</div>
              </div>
            </div>

            {/* 缘分力量提示 */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">✨</span>
                <span className="text-purple-300 font-medium">Your Words Create Destiny</span>
              </div>
              <div className="text-white">
                Suggested range: <span className="font-bold">{symbol}{config.suggestedMin.toLocaleString()} - {symbol}{config.suggestedMax.toLocaleString()}</span>
              </div>
              <div className="text-purple-200 text-sm mt-1">
                💫 Sometimes it's not the highest bid, but the right connection that wins
              </div>
            </div>

            {/* 出价输入 */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  💫 Express Your Connection
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                    {symbol}
                  </span>
                  <input
                    type="number"
                    value={offer}
                    onChange={(e) => handleOfferChange(e.target.value)}
                    placeholder={`${config.suggestedMin.toLocaleString()}`}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 买家留言输入 */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Add a short note to earn the choice
                  <span className="text-xs text-purple-300 ml-2">Your words unlock extra worth</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 120))}
                  placeholder="Tell why it should be you"
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  maxLength={120}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-purple-200">A sincere line can tip the scale</p>
                  <span className="text-xs text-gray-400">{message.length}/120</span>
                </div>
              </div>

              <div>
                {showSuggestion && (
                  <div className="mt-2 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg">
                    <div className="flex items-center text-yellow-300">
                      <span className="text-lg mr-2">💫</span>
                      <span className="text-sm">
                        Not the highest? Win by meaning — enhance your note to strengthen your connection!
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !offer}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold text-lg rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg relative overflow-hidden"
                style={{ 
                  background: loading || !offer ? undefined : `linear-gradient(135deg, ${config.theme}, ${config.theme}dd)`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Activating Destiny...
                    </div>
                  ) : (
                    <>
                      <span className="text-xl mr-2">✨</span>
                      Activate Your Destiny Power
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* 安全保障 */}
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Secure Escrow
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Verified Safe
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-1">🍀</span>
                Lucky Guarantee
              </div>
            </div>

            {/* 底部链接 */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-400">
                <span className="text-purple-400 mr-1">💫</span>
                <span>Destiny Favors Connection</span>
              </div>
              <Link 
                to="/buyer-dashboard" 
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                My Connections →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}