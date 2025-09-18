import React, { useState } from 'react'
import { Copy, ExternalLink, Share2, Code, MessageCircle, QrCode, Plus, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react'
import { useMerchantStore } from '../../stores/merchantStore'
import { ShareCardGenerator } from '../ShareCard/ShareCardGenerator'
import { CreateProductModal } from './CreateProductModal'
import { toast } from 'react-hot-toast'

export const ProductLinkGenerator: React.FC = () => {
  const { bidForms } = useMerchantStore()
  const [selectedForm, setSelectedForm] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'link' | 'embed' | 'share'>('link')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const selectedProduct = bidForms.find(form => form.id === selectedForm)

  const generateProductLink = () => {
    if (!selectedProduct) return ''
    return `${window.location.origin}/bid/${selectedProduct.id}`
  }

  const generateEmbedCode = () => {
    if (!selectedProduct) return ''
    
    const htmlCode = `<!-- BidForm Widget -->
<div id="bidform-widget-${selectedProduct.id}"></div>
<script src="${window.location.origin}/widget.js"></script>
<script>
BidForm.init({
  containerId: 'bidform-widget-${selectedProduct.id}',
  formId: '${selectedProduct.id}',
  title: '${selectedProduct.title}',
  price: ${selectedProduct.price},
  currency: '${selectedProduct.currency}',
  depositPercentage: ${selectedProduct.deposit_percentage}
});
</script>`

    return htmlCode
  }

  const generateReactCode = () => {
    if (!selectedProduct) return ''
    
    return `import { BidWidget } from '@bidform/react'

function MyComponent() {
  return (
    <BidWidget
      formId="${selectedProduct.id}"
      title="${selectedProduct.title}"
      price={${selectedProduct.price}}
      currency="${selectedProduct.currency}"
      depositPercentage={${selectedProduct.deposit_percentage}}
      themeColor="${selectedProduct.theme_color}"
    />
  )
}`
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copied to clipboard!`)
    }).catch(() => {
      toast.error('Failed to copy to clipboard')
    })
  }

  const shareToSocial = (platform: string) => {
    if (!selectedProduct) return
    
    const productLink = generateProductLink()
    const text = `Check out this ${selectedProduct.title} - Starting at ${selectedProduct.currency} ${(selectedProduct.price || selectedProduct.starting_price || 0).toLocaleString()}. Make an offer now!`
    
    let shareUrl = ''
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(productLink)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productLink)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productLink)}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + productLink)}`
        break
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we copy to clipboard
        navigator.clipboard.writeText(`${text} ${productLink}`).then(() => {
          toast.success('Content copied! Open Instagram and paste in your story or post.')
          // Optionally open Instagram web
          window.open('https://www.instagram.com/', '_blank')
        }).catch(() => {
          toast.error('Failed to copy content')
        })
        return
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Earn the Choice Link Generator</h2>
            <p className="text-gray-600 mt-1">Create powerful links that help buyers earn their choice through meaningful connections</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Product
          </button>
        </div>

        {/* Product Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Product
          </label>
          {bidForms.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-gray-400 mb-4">
                <Plus className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Yet</h3>
              <p className="text-gray-600 mb-4">Create your first product to start generating links</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                Create Your First Product
              </button>
            </div>
          ) : (
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="">Choose a product...</option>
              {bidForms.map((form) => (
                <option key={form.id} value={form.id}>
                  {form.title} - {form.currency} {(form.price || form.starting_price || 0).toLocaleString()} (Deposit: {form.deposit_percentage}%)
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedProduct && (
          <>
            {/* Product Preview */}
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
              <div className="flex items-start space-x-4">
                {selectedProduct.image_url ? (
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.title}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-20 h-20 bg-purple-200 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedProduct.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{selectedProduct.description}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <span className="text-lg font-bold text-purple-600">
                      {selectedProduct.currency} {(selectedProduct.price || selectedProduct.starting_price || 0).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      Deposit: {selectedProduct.deposit_percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => setActiveTab('link')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === 'link'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ExternalLink className="w-4 h-4 inline mr-2" />
                Product Link
              </button>
              <button
                onClick={() => setActiveTab('embed')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === 'embed'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Code className="w-4 h-4 inline mr-2" />
                Embed Code
              </button>
              <button
                onClick={() => setActiveTab('share')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === 'share'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Share2 className="w-4 h-4 inline mr-2" />
                💫 Earn the Choice
              </button>
            </div>

            {/* Product Link Tab */}
            {activeTab === 'link' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Shareable Product Link
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={generateProductLink()}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 pr-12"
                      />
                      <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                    <button
                      onClick={() => copyToClipboard(generateProductLink(), 'Product link')}
                      className="bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </button>
                  </div>
                </div>

                {/* Social Sharing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Share on Social Media
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <button
                      onClick={() => shareToSocial('twitter')}
                      className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </button>
                    <button
                      onClick={() => shareToSocial('facebook')}
                      className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook
                    </button>
                    <button
                      onClick={() => shareToSocial('linkedin')}
                      className="flex items-center justify-center px-4 py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-colors"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </button>
                    <button
                      onClick={() => shareToSocial('whatsapp')}
                      className="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </button>
                    <button
                      onClick={() => shareToSocial('instagram')}
                      className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors"
                    >
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* High-Conversion Share Tab */}
            {activeTab === 'share' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    💫 Earn the Choice System
                  </h3>
                  <p className="text-gray-600">
                    Activate your destiny power - where authentic words unlock extra worth
                  </p>
                </div>

                <ShareCardGenerator
                  title={selectedProduct.title || 'Premium Product'}
                  brand={selectedProduct.merchant_id || 'Premium Brand'}
                  image={selectedProduct.image_url || 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?q=80&w=1200&auto=format&fit=crop'}
                  currency={selectedProduct.currency || 'USD'}
                  startingPrice={selectedProduct.price || 1000}
                  currentHighest={Math.floor((selectedProduct.price || 1000) * 1.15)}
                  timeLeft="3天 12小时"
                  totalOffers={Math.floor(Math.random() * 20) + 5}
                  theme={'#DC2626'}
                  formId={selectedProduct.id}
                />
              </div>
            )}

            {/* Embed Code Tab */}
            {activeTab === 'embed' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    HTML Embed Code
                  </label>
                  <div className="relative">
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto text-sm">
                      <code>{generateEmbedCode()}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(generateEmbedCode(), 'HTML embed code')}
                      className="absolute top-3 right-3 bg-gray-700 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition-colors flex items-center"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    React Component Code
                  </label>
                  <div className="relative">
                    <pre className="bg-gray-900 text-blue-400 p-4 rounded-xl overflow-x-auto text-sm">
                      <code>{generateReactCode()}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(generateReactCode(), 'React component code')}
                      className="absolute top-3 right-3 bg-gray-700 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition-colors flex items-center"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Integration Instructions</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Copy the HTML code and paste it into your website where you want the bid widget to appear</li>
                    <li>• The widget will automatically load and display your product with bidding functionality</li>
                    <li>• For React projects, install our package: <code className="bg-blue-100 px-1 rounded">npm install @bidform/react</code></li>
                    <li>• The widget is fully responsive and will adapt to your site's design</li>
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  )
}