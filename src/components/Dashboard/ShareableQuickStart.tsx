import React, { useState } from 'react'
import { Copy, Check, ExternalLink, Share2, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useDemoStore } from '../../stores/demoStore'

export const ShareableQuickStart: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const { demoBidForms } = useDemoStore()
  
  // 使用第一个演示表单作为示例
  const sampleForm = demoBidForms[0]

  const generateShareableLink = () => {
    if (!sampleForm) return '#'
    return `${window.location.origin}/bid/${sampleForm.id}`
  }

  const copyShareLink = () => {
    const shareLink = generateShareableLink()
    const shareText = sampleForm ? 
      `${sampleForm.title} - 起价 ${sampleForm.currency} ${sampleForm.price.toLocaleString()}，快来出价吧！\n${shareLink}` : ''
    
    if (shareText) {
      navigator.clipboard.writeText(shareText)
      setCopied(true)
      toast.success('分享链接已复制到剪贴板！')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const openShareLink = () => {
    window.open(generateShareableLink(), '_blank')
  }

  const shareToWeChat = () => {
    // 微信分享逻辑（实际项目中需要集成微信SDK）
    toast.success('请复制链接到微信分享')
    copyShareLink()
  }

  const shareToWeibo = () => {
    const shareLink = generateShareableLink()
    const shareText = encodeURIComponent(`${sampleForm?.title} - 起价 ${sampleForm?.currency} ${sampleForm?.price.toLocaleString()}，快来出价吧！`)
    const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareLink)}&title=${shareText}`
    window.open(weiboUrl, '_blank')
  }

  if (!sampleForm) return null

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Share2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          快速开始 - 分享出价链接
        </h3>
        <p className="text-gray-600">
          创建产品出价链接，一键分享到社交平台，让更多人参与出价
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 步骤1：生成分享链接 */}
        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              1
            </div>
            <h4 className="font-semibold text-gray-900">生成分享链接</h4>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-purple-700 font-medium">产品出价链接</span>
              <div className="flex space-x-2">
                <button
                  onClick={copyShareLink}
                  className="flex items-center text-purple-600 hover:text-purple-700 transition-colors text-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      已复制!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      复制
                    </>
                  )}
                </button>
                <button
                  onClick={openShareLink}
                  className="flex items-center text-purple-600 hover:text-purple-700 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  预览
                </button>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex items-start space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-gray-900 truncate">{sampleForm.title}</h5>
                  <p className="text-sm text-gray-600">起价 {sampleForm.currency} {sampleForm.price.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-xs text-purple-600 font-mono break-all bg-gray-50 p-2 rounded">
                {generateShareableLink()}
              </p>
            </div>
          </div>
        </div>

        {/* 步骤2：分享到社交平台 */}
        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              2
            </div>
            <h4 className="font-semibold text-gray-900">分享到社交平台</h4>
          </div>

          <div className="space-y-3">
            <button
              onClick={shareToWeChat}
              className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-xl border border-green-200 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">微信朋友圈</p>
                  <p className="text-sm text-gray-600">分享给微信好友</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={shareToWeibo}
              className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">新浪微博</p>
                  <p className="text-sm text-gray-600">发布到微博</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </button>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-sm text-gray-600">
                <p className="mb-2">✅ 手机端完美适配</p>
                <p className="mb-2">✅ 社交平台友好</p>
                <p className="mb-2">✅ 实时出价通知</p>
                <p>✅ 安全支付保障</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold mb-1">准备好开始了吗？</h4>
            <p className="text-purple-100 text-sm">创建你的第一个出价表单，开始接收出价</p>
          </div>
          <button className="bg-white text-purple-600 px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
            创建表单
          </button>
        </div>
      </div>
    </div>
  )
}