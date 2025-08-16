import React, { useState } from 'react'
import { X, DollarSign } from 'lucide-react'
import { useMerchantStore } from '../../stores/merchantStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().optional(),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  currency: z.string().min(1, 'Currency is required'),
  theme_color: z.string().min(1, 'Theme color is required'),
})

type FormData = z.infer<typeof formSchema>

interface CreateBidFormModalProps {
  isOpen: boolean
  onClose: () => void
  merchantId: string
}

export const CreateBidFormModal: React.FC<CreateBidFormModalProps> = ({
  isOpen,
  onClose,
  merchantId
}) => {
  const [loading, setLoading] = useState(false)
  const { createBidForm } = useMerchantStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: 'USD',
      theme_color: '#7C3AED'
    }
  })

  if (!isOpen) return null

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await createBidForm({
        merchant_id: merchantId,
        title: data.title,
        description: data.description || null,
        price: data.price,
        currency: data.currency,
        theme_color: data.theme_color,
        is_active: true,
        custom_css: null
      })
      
      toast.success('Bid form created successfully!')
      reset()
      onClose()
    } catch (error: any) {
      toast.error('Failed to create bid form')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Bid Form</h2>
            <p className="text-gray-600">Set up a new bid form for your product or service</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product/Service Title *
              </label>
              <input
                {...register('title')}
                type="text"
                placeholder="e.g., Vintage Rolex Watch"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Brief description of your item..."
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Price *
                </label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency *
                </label>
                <select
                  {...register('currency')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme Color *
              </label>
              <div className="flex items-center space-x-4">
                <input
                  {...register('theme_color')}
                  type="color"
                  className="w-12 h-12 border border-gray-300 rounded-xl cursor-pointer"
                />
                <input
                  {...register('theme_color')}
                  type="text"
                  placeholder="#7C3AED"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
              <div className="bg-white border-2 border-purple-200 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Sample Product</h3>
                <p className="text-gray-600 text-sm mb-4">This is how your bid form will appear</p>
                <button 
                  type="button"
                  className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all"
                  style={{ backgroundColor: '#7C3AED' }}
                >
                  Make an Offer
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Form'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}