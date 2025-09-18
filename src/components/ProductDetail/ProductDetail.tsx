import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMerchantStore } from '../../stores/merchantStore'
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Eye, 
  Share2, 
  Clock,
  MapPin,
  User,
  MessageSquare,
  TrendingUp,
  Award,
  CheckCircle
} from 'lucide-react'

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { offers } = useMerchantStore()
  
  // 根据ID查找对应的产品信息
  const product = offers.find(offer => offer.form_id === id)
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">产品未找到</h2>
          <p className="text-gray-600 mb-6">抱歉，找不到您要查看的产品信息。</p>
          <button
            onClick={() => navigate('/buyer-dashboard')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            返回我的出价
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回
            </button>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：产品图片和基本信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 产品图片 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center">
                    <Award className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">产品图片</p>
                  </div>
                )}
              </div>
              
              {/* 产品标题和状态 */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      发布于 {new Date(product.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {Math.floor(Math.random() * 100) + 50} 次查看
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  product.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {product.status === 'pending' ? '等待回复' :
                   product.status === 'accepted' ? '已接受' : '已拒绝'}
                </span>
              </div>

              {/* 产品描述 */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">产品描述</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || '暂无详细描述'}
                </p>
              </div>
            </div>

            {/* 出价历史 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">出价信息</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{product.buyer_name || '匿名用户'}</p>
                      <p className="text-sm text-gray-600">{product.buyer_email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">¥{product.offer_amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(product.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {product.message && (
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-start">
                      <MessageSquare className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900 mb-1">买家留言</p>
                        <p className="text-blue-800">{product.message}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：价格和操作 */}
          <div className="space-y-6">
            {/* 价格信息 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">价格信息</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">市场价</span>
                  <span className="text-lg font-semibold">¥{product.market_price?.toLocaleString() || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">最低出价</span>
                  <span className="text-lg font-semibold">¥{product.minimum_bid?.toLocaleString() || 'N/A'}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-medium">我的出价</span>
                    <span className="text-2xl font-bold text-purple-600">¥{product.offer_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 支付状态 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">支付状态</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">定金 (10%)</p>
                    <p className="text-sm text-gray-600">¥{Math.ceil(product.offer_amount * 0.1).toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    (product.prepayment_status || 'pending') === 'succeeded' ? 'bg-green-100 text-green-800' :
                    (product.prepayment_status || 'pending') === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {(product.prepayment_status || 'pending') === 'succeeded' ? '已支付' :
                     (product.prepayment_status || 'pending') === 'pending' ? '待支付' : '支付失败'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">尾款 (90%)</p>
                    <p className="text-sm text-gray-600">¥{(product.offer_amount - Math.ceil(product.offer_amount * 0.1)).toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    (product.balance_payment_status || 'pending') === 'succeeded' ? 'bg-green-100 text-green-800' :
                    (product.balance_payment_status || 'pending') === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {(product.balance_payment_status || 'pending') === 'succeeded' ? '已支付' :
                     (product.balance_payment_status || 'pending') === 'pending' ? '待支付' : '支付失败'}
                  </span>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="space-y-3">
                {product.status === 'pending' && (
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-yellow-800 font-medium">等待商家回复</p>
                    <p className="text-yellow-600 text-sm">您的出价正在审核中</p>
                  </div>
                )}
                
                {product.status === 'accepted' && (
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-medium">出价已接受</p>
                    <p className="text-green-600 text-sm">请完成尾款支付</p>
                  </div>
                )}
                
                <button
                  onClick={() => navigate('/buyer-dashboard')}
                  className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  返回我的出价
                </button>
                
                <button
                  onClick={() => navigate(`/transaction/${product.id}`)}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  查看交易详情
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}