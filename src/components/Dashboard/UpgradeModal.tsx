import React from 'react'
import { useTranslation } from 'react-i18next'
import { X, Check, Zap, Crown, Rocket } from 'lucide-react'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
  currentUsage: number
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  currentUsage
}) => {
  const { t } = useTranslation()

  if (!isOpen) return null

  const plans = [
    {
      name: 'Starter',
      price: 19,
      forms: 50,
      submissions: 20,
      icon: <Zap className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      features: [
        '50 bid forms',
        '20 monthly payment submissions',
        'Customer support',
        'Basic analytics',
        'Email notifications',
        'Standard templates'
      ],
      extraResources: '5% service fee'
    },
    {
      name: 'Pro',
      price: 49,
      forms: 500,
      submissions: 2000,
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      popular: true,
      features: [
        '500 bid forms',
        '2,000 monthly payment submissions',
        'Priority customer support',
        'Advanced analytics',
        'Custom branding',
        'Webhook integration',
        'API access'
      ],
      extraResources: '5% service fee'
    },
    {
      name: 'Custom Plan',
      price: 149,
      forms: Infinity,
      submissions: 20000,
      icon: <Rocket className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-500',
      features: [
        'Unlimited bid forms',
        '20,000 monthly payment submissions',
        'Premium customer support',
        'White-label solution',
        'Full API access',
        'Custom integrations',
        'Dedicated account manager'
      ],
      extraResources: '5% service fee'
    }
  ]

  const handleUpgrade = (planName: string, price: number) => {
    // TODO: 实现实际的升级逻辑
    alert(`Upgrading to ${planName} plan ($${price}/month)...`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-gray-200">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Upgrade Your Plan</h2>
            <p className="text-gray-600 mt-2">
              You're currently on the <span className="font-semibold">{currentPlan}</span> plan with {currentUsage} forms used
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl border-2 p-8 ${
                  plan.popular ? 'border-purple-500 shadow-xl' : 'border-gray-200 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    ${plan.price}
                    <span className="text-lg font-normal text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600">
                    {plan.forms === Infinity ? 'Unlimited bid forms' : `${plan.forms.toLocaleString()} bid forms`}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {plan.submissions.toLocaleString()} monthly submissions
                  </p>
                </div>

                <ul className="space-y-4 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Extra Resources Support */}
                <div className="mb-8 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-800">Extra Resources Support</span>
                    </div>
                    <span className="text-sm font-bold text-orange-600">{plan.extraResources}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 ml-5">
                    Service fee applies to resources exceeding plan limits
                  </p>
                </div>

                <button
                  onClick={() => handleUpgrade(plan.name, plan.price)}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
                      : plan.name === '自定义版本'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.name === 'Custom Plan' ? 'Contact Sales' : 
                   plan.forms !== Infinity && currentUsage > plan.forms ? 'Downgrade' : 'Upgrade'} to {plan.name}
                </button>

                {plan.forms !== Infinity && currentUsage > plan.forms && (
                  <p className="text-xs text-red-600 mt-2 text-center">
                    ⚠️ You have more forms than this plan allows
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Frequently Asked Questions
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  💰 How do service fees work?
                </h4>
                <p className="text-gray-600 text-sm">
                  Resources within your subscription are <strong>included in your plan</strong>. 
                  If you exceed your limits, only the extra resources will have a 5% service fee on transactions.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  🔄 Can I change plans anytime?
                </h4>
                <p className="text-gray-600 text-sm">
                  Yes! You can upgrade or downgrade your plan at any time. 
                  Changes take effect immediately and billing is prorated.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  📊 What happens to my existing resources?
                </h4>
                <p className="text-gray-600 text-sm">
                  All your existing resources remain active. If you downgrade to a plan with fewer included resources, 
                  the excess resources will incur 5% service fees.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  🎯 Free trial available?
                </h4>
                <p className="text-gray-600 text-sm">
                  You're already on our free plan! Upgrade anytime to get more included resources. 
                  No commitment required.
                </p>
              </div>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 text-center border border-green-200">
            <div className="text-2xl mb-2">💚</div>
            <h4 className="font-bold text-gray-900 mb-2">30-Day Money Back Guarantee</h4>
            <p className="text-gray-600 text-sm">
              Not satisfied? Get a full refund within 30 days, no questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}