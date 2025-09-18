import React, { useState } from 'react'
import { Copy, Check, ExternalLink, Share2, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useDemoStore } from '../../stores/demoStore'

export const ShareableQuickStart: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const { demoBidForms } = useDemoStore()
  
  // Use the first demo form as example
  const sampleForm = demoBidForms[0]

  const generateShareableLink = () => {
    if (!sampleForm) return '#'
    return `${window.location.origin}/bid/${sampleForm.id}`
  }

  const copyShareLink = () => {
    const shareLink = generateShareableLink()
    const shareText = sampleForm ? 
      `${sampleForm.title} - Starting at ${sampleForm.currency} ${sampleForm.price.toLocaleString()}, come and bid!\n${shareLink}` : ''
    
    if (shareText) {
      navigator.clipboard.writeText(shareText)
      setCopied(true)
      toast.success('Share link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const openShareLink = () => {
    window.open(generateShareableLink(), '_blank')
  }

  const shareToWeChat = () => {
    // WeChat sharing logic (requires WeChat SDK integration in real project)
    toast.success('Please copy the link to share on WeChat')
    copyShareLink()
  }

  const shareToWeibo = () => {
    const shareLink = generateShareableLink()
    const shareText = encodeURIComponent(`${sampleForm?.title} - Starting at ${sampleForm?.currency} ${sampleForm?.price.toLocaleString()}, come and bid!`)
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
          Quick Start - Share Bid Links
        </h3>
        <p className="text-gray-600">
          Create product bid links and share to social platforms with one click to get more people bidding
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Step 1: Generate Share Link */}
        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              1
            </div>
            <h4 className="font-semibold text-gray-900">Generate Share Link</h4>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-purple-700 font-medium">Product Bid Link</span>
              <div className="flex space-x-2">
                <button
                  onClick={copyShareLink}
                  className="flex items-center text-purple-600 hover:text-purple-700 transition-colors text-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={openShareLink}
                  className="flex items-center text-purple-600 hover:text-purple-700 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Preview
                </button>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex items-start space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-gray-900 truncate">{sampleForm.title}</h5>
                  <p className="text-sm text-gray-600">Starting at {sampleForm.currency} {sampleForm.price.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-xs text-purple-600 font-mono break-all bg-gray-50 p-2 rounded">
                {generateShareableLink()}
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Share to Social Platforms */}
        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              2
            </div>
            <h4 className="font-semibold text-gray-900">Share to Social Platforms</h4>
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
                  <p className="font-medium text-gray-900">WeChat Moments</p>
                  <p className="text-sm text-gray-600">Share to WeChat friends</p>
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
                  <p className="font-medium text-gray-900">Sina Weibo</p>
                  <p className="text-sm text-gray-600">Post to Weibo</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </button>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-sm text-gray-600">
                <p className="mb-2">✅ Perfect mobile adaptation</p>
                <p className="mb-2">✅ Social platform friendly</p>
                <p className="mb-2">✅ Real-time bid notifications</p>
                <p>✅ Secure payment protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold mb-1">Ready to get started?</h4>
            <p className="text-purple-100 text-sm">Create your first bid form and start receiving offers</p>
          </div>
          <button className="bg-white text-purple-600 px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
            Create Form
          </button>
        </div>
      </div>
    </div>
  )
}