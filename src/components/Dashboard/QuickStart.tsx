import React, { useState } from 'react'
import { Copy, Check, ExternalLink, Zap, Target, Code } from 'lucide-react'
import { useMerchantStore } from '../../stores/merchantStore'
import toast from 'react-hot-toast'

export const QuickStart: React.FC = () => {
  const { merchant, bidForms } = useMerchantStore()
  const [copied, setCopied] = useState(false)

  const sampleForm = bidForms[0] // 使用第一个表单作为示例

  const generateEmbedCode = () => {
    if (!sampleForm || !merchant) return ''
    
    return `<script src="https://cdn.bidform.online/widget.js"
  data-merchant="${merchant.id}"
  data-form-id="${sampleForm.id}"
  data-title="${sampleForm.title}"
  data-price="${sampleForm.price}"
  data-currency="${sampleForm.currency}"
  data-theme="${sampleForm.theme_color}"
  async></script>
<div id="bidform-widget"></div>`
  }

  const copyEmbedCode = () => {
    const code = generateEmbedCode()
    if (code) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Embed code copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const generateShareableLink = () => {
    if (!sampleForm) return '#'
    return `${window.location.origin}/demo?form=${sampleForm.id}`
  }

  if (!sampleForm) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Get Started?</h3>
          <p className="text-gray-600 mb-6">Create your first bid form to start accepting offers!</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all">
              Create Your First Form
            </button>
            <a 
              href="/demo" 
              target="_blank"
              className="border border-purple-300 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-xl font-semibold transition-all flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Try Demo
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">🚀 Quick Start Guide</h3>
          <p className="text-gray-600">Get your bid form live in 30 seconds</p>
        </div>
        <div className="flex space-x-2">
          <a 
            href={generateShareableLink()}
            target="_blank"
            className="flex items-center px-3 py-2 text-sm font-medium text-purple-600 bg-white hover:bg-purple-50 rounded-xl border border-purple-200 transition-colors"
          >
            <Target className="w-4 h-4 mr-2" />
            Test Live
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Step 1: Copy Code */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              1
            </div>
            <h4 className="font-semibold text-gray-900">Copy embed code</h4>
          </div>
          
          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
              <span className="text-gray-300 text-sm font-mono">embed.html</span>
              <button
                onClick={copyEmbedCode}
                className="flex items-center text-gray-400 hover:text-white transition-colors text-sm"
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
            </div>
            <div className="p-4">
              <pre className="text-green-400 text-xs overflow-x-auto">
                <code>{generateEmbedCode()}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Step 2: Paste & Go Live */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              2
            </div>
            <h4 className="font-semibold text-gray-900">Paste anywhere & go live</h4>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white border-2 border-purple-200 rounded-2xl p-4">
              <h5 className="font-semibold text-gray-900 mb-2">{sampleForm.title}</h5>
              <p className="text-2xl font-bold text-purple-600 mb-4">
                {sampleForm.currency} {sampleForm.price.toLocaleString()}
              </p>
              <button 
                className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all"
                style={{ backgroundColor: sampleForm.theme_color }}
              >
                Make an Offer
              </button>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Powered by BidForm
              </p>
            </div>
            
            <div className="text-sm text-gray-600">
              <p className="mb-2">✅ Works on any website</p>
              <p className="mb-2">✅ Mobile responsive</p>
              <p className="mb-2">✅ Secure payments</p>
              <p>✅ Real-time notifications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start">
          <Code className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h5 className="font-semibold text-blue-900 mb-1">Pro Tip</h5>
            <p className="text-sm text-blue-800">
              The widget automatically detects your page content and can pre-fill product information. 
              You can also customize colors, add custom CSS, and set up webhooks for advanced integrations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}