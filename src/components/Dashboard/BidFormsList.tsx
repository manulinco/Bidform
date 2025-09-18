import React, { useState } from 'react'
import { Database } from '../../lib/supabase'
import { BidWidget } from '../BidWidget/BidWidget'
import { Copy, ExternalLink, Eye, EyeOff, Settings, Code } from 'lucide-react'
import toast from 'react-hot-toast'

type BidForm = Database['public']['Tables']['bid_forms']['Row']

interface BidFormsListProps {
  forms: BidForm[]
}

export const BidFormsList: React.FC<BidFormsListProps> = ({ forms }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<string | null>(null)

  const copyShareLink = (form: BidForm) => {
    const shareLink = `${window.location.origin}/bid/${form.id}`
    const shareText = `${form.title} - 起价 ${form.currency} ${form.price.toLocaleString()}，快来出价吧！
${shareLink}`

    navigator.clipboard.writeText(shareText)
    setCopiedId(form.id)
    toast.success('分享链接已复制到剪贴板！')
    
    setTimeout(() => setCopiedId(null), 2000)
  }

  const openShareLink = (form: BidForm) => {
    const shareLink = `${window.location.origin}/bid/${form.id}`
    window.open(shareLink, '_blank')
  }

  if (forms.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Code className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bid forms yet</h3>
        <p className="text-gray-600 mb-6">Create your first bid form to start accepting offers.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {forms.map((form) => (
        <div key={form.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{form.title}</h3>
                <div className="ml-3 flex items-center">
                  {form.is_active ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Eye className="w-3 h-3 mr-1" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <EyeOff className="w-3 h-3 mr-1" />
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              
              {form.description && (
                <p className="text-gray-600 mb-3">{form.description}</p>
              )}
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="font-medium">
                  {form.currency} {form.price.toLocaleString()}
                </span>
                <span>•</span>
                <span>Created {new Date(form.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => copyShareLink(form)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                {copiedId === form.id ? (
                  <>
                    <Copy className="w-4 h-4 mr-2 text-green-600" />
                    已复制!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    复制链接
                  </>
                )}
              </button>
              
              <button 
                onClick={() => openShareLink(form)}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                查看页面
              </button>
              
              <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Share Link Preview */}
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">分享链接</h4>
              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                可直接分享到社交平台
              </span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">{form.title} - 起价 {form.currency} {form.price.toLocaleString()}，快来出价吧！</p>
              <p className="text-xs text-purple-600 font-mono break-all">
                {window.location.origin}/bid/{form.id}
              </p>
            </div>
          </div>

          {/* Live Preview */}
          {previewId === form.id && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-4">Live Preview</h4>
              <div className="max-w-md">
                <BidWidget
                  formId={form.id}
                  title={form.title}
                  price={form.price}
                  currency={form.currency}
                  themeColor={form.theme_color}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}