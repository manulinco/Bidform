import React from 'react'
import { X, Check, Zap, Crown, Rocket, Star } from 'lucide-react'

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
  if (!isOpen) return null

  const plans = [
    {
      name: 'Free',
      price: 0,
      forms: 5,
      submissions: 20,
      icon: <Star className="w-6 h-6" />,
      color: 'from-gray-500 to-gray-600',
      features: [
        '5 bid forms',
        '20 monthly submissions',
        'Basic customer support',
        'Standard templates',
        'Email notifications',
        'CSV export'
      ]
    },
    {
      name: 'Starter',
      price: 29,
      forms: 100,
      submissions: 500,
      icon: <Zap className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      features: [
        '100 bid forms',
        '500 monthly submissions',
        'Priority customer support',
        'Basic analytics',
        'Custom branding',
        'Email & SMS notifications',
        'Advanced templates'
      ]
    },
    {
      name: 'Pro',
      price: 79,
      forms: 500,
      submissions: 2500,
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      popular: true,
      features: [
        '500 bid forms',
        '2,500 monthly submissions',
        'Premium customer support',
        'Advanced analytics & reporting',
        'Full custom branding',
        'Webhook integration',
        'API access',
        'Multi-user accounts'
      ]
    },
    {
      name: 'Enterprise',
      price: 199,
      forms: Infinity,
      submissions: 10000,
      icon: <Rocket className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-500',
      features: [
        'Unlimited bid forms',
        '10,000 monthly submissions',
        'Dedicated account manager',
        'White-label solution',
        'Full API access',
        'Custom integrations',
        'Advanced security features',
        'SLA guarantee'
      ]
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

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.name, plan.price)}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
                      : plan.name === 'Enterprise'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg'
                      : plan.name === 'Free'
                      ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                  disabled={plan.name === 'Free'}
                >
                  {plan.name === 'Free' ? 'Current Plan' :
                   plan.name === 'Enterprise' ? 'Contact Sales' : 
                   plan.forms !== Infinity && currentUsage > plan.forms ? 'Downgrade' : 'Upgrade'} {plan.name !== 'Free' ? `to ${plan.name}` : ''}
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
                  💰 How does billing work?
                </h4>
                <p className="text-gray-600 text-sm">
                  All plans are billed monthly. Your subscription includes all the features and limits shown. 
                  No hidden fees or transaction charges.
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
                  📊 What happens if I exceed my limits?
                </h4>
                <p className="text-gray-600 text-sm">
                  If you approach your plan limits, we'll notify you to upgrade. 
                  Your service continues uninterrupted while you decide.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  🎯 Is there a free trial?
                </h4>
                <p className="text-gray-600 text-sm">
                  Yes! Start with our Free plan to test all features. 
                  Upgrade anytime when you need more capacity.
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