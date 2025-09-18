import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BidWidget } from '../BidWidget/BidWidget'
import { useMerchantStore } from '../../stores/merchantStore'
import { Heart, Share2, ArrowLeft, Star, Users, Clock, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { BidForm } from '../../types'

export const BidPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>()
  const { bidForms, initialize } = useMerchantStore()
  const [product, setProduct] = useState<BidForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [bidCount, setBidCount] = useState(0)
  const [marketPrice, setMarketPrice] = useState(0)
  const [suggestedBids, setSuggestedBids] = useState<{
    conservative: number
    moderate: number
    aggressive: number
  } | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)
      
      try {
        // 总是先初始化数据
        await initialize('demo-user-123')
        
        // 等待一小段时间确保数据加载完成
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if (formId) {
          // 重新获取最新的 bidForms
          const { bidForms: currentBidForms } = useMerchantStore.getState()
          const foundProduct = currentBidForms.find(form => form.id === formId)
          
          if (foundProduct) {
            setProduct(foundProduct)
            
            // 计算市场价格（比起拍价高15-25%）
            const marketPriceMultiplier = 1.15 + Math.random() * 0.1
            const productPrice = foundProduct.price || foundProduct.starting_price || 0
            const calculatedMarketPrice = Math.round(productPrice * marketPriceMultiplier)
            setMarketPrice(calculatedMarketPrice)
            
            // 模拟出价次数（3-20次）
            const simulatedBidCount = Math.floor(Math.random() * 18) + 3
            setBidCount(simulatedBidCount)
            
            // 计算智能出价建议
            if (productPrice && foundProduct.min_bid_ratio) {
              const minBidAmount = Math.ceil(productPrice * foundProduct.min_bid_ratio / 100)
              setSuggestedBids({
                conservative: Math.round(minBidAmount * 1.05), // 比最低出价高5%
                moderate: Math.round(minBidAmount * 1.15),     // 比最低出价高15%
                aggressive: Math.round(minBidAmount * 1.25)    // 比最低出价高25%
              })
            }
          }
        }
      } catch (error) {
        console.error('Load product error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadProduct()
  }, [formId, initialize])

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.title,
          text: `${product.title} - 市场价 ${product.currency} ${marketPrice.toLocaleString()}，已有 ${bidCount} 人出价！`,
          url: window.location.href
        })
      } catch (error) {
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    if (product) {
      const shareText = `${product.title} - 市场价 ${product.currency} ${marketPrice.toLocaleString()}，已有 ${bidCount} 人出价！\n${window.location.href}`
      navigator.clipboard.writeText(shareText)
      toast.success('链接已复制到剪贴板！')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">产品未找到</h1>
          <p className="text-gray-600 mb-6">抱歉，您访问的出价表单不存在或已下线。</p>
          <a 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a 
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回首页
            </a>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </button>
              <button className="flex items-center px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <Heart className="w-4 h-4 mr-2" />
                收藏
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image & Stats */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-100 relative overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-8xl">🎯</div>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-purple-600">
                  热门
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-5 h-5 text-purple-600 mr-1" />
                      <span className="font-semibold text-gray-900">{bidCount}</span>
                    </div>
                    <p className="text-sm text-gray-600">人出价</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600 mr-1" />
                      <span className="font-semibold text-gray-900">{product.currency} {marketPrice.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">市场价</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="w-5 h-5 text-orange-500 mr-1" />
                      <span className="font-semibold text-gray-900">2天</span>
                    </div>
                    <p className="text-sm text-gray-600">剩余时间</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {product.title}
              </h1>
              
              {product.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">产品描述</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-1">市场参考价</p>
                  <p className="text-2xl font-bold text-green-600">
                    {product.currency} {marketPrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">基于市场分析</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-1">最低出价</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {product.currency} {Math.ceil((product.price || 0) * (product.min_bid_ratio || 70) / 100).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">起拍价的 {product.min_bid_ratio || 70}%</p>
                </div>
              </div>


            </div>

            {/* Features */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">出价说明</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">低门槛出价</p>
                    <p className="text-sm text-gray-600">仅需支付 {product.deposit_percentage || 10}% 定金锁定出价</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">分期支付</p>
                    <p className="text-sm text-gray-600">商家接受后支付剩余 {100 - (product.deposit_percentage || 10)}% 金额</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">风险保障</p>
                    <p className="text-sm text-gray-600">出价被拒绝将全额退还定金</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">安全支付</p>
                    <p className="text-sm text-gray-600">企业级支付安全，买家保障</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bid Widget */}
          <div className="lg:sticky lg:top-24 h-fit">
            <BidWidget 
              formId={product.id}
              title={product.title}
              price={product.price || 0}
              currency={product.currency}
              minBidRatio={product.min_bid_ratio || 70}
              depositPercentage={product.deposit_percentage || 10}
              allowOptionalMessage={product.allow_optional_message || true}
              themeColor={product.theme_color}
              marketPrice={marketPrice}
              bidCount={bidCount}
              suggestedBids={suggestedBids}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Powered by <span className="font-semibold text-purple-600">BidForm.online</span>
            </p>
            <p className="text-sm text-gray-500">
              安全的在线出价平台 - 让交易更简单
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}