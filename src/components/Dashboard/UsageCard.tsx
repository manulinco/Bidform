import React from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart3, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'

interface UsageCardProps {
  currentForms: number
  planLimit: number
  planName: string
  onUpgrade?: () => void
}

export const UsageCard: React.FC<UsageCardProps> = ({
  currentForms,
  planLimit,
  planName,
  onUpgrade
}) => {
  const { t } = useTranslation()
  
  const usagePercentage = (currentForms / planLimit) * 100
  const isOverLimit = currentForms > planLimit
  const isNearLimit = usagePercentage >= 80 && !isOverLimit
  const formsWithFee = Math.max(0, currentForms - planLimit)
  
  const getStatusColor = () => {
    if (isOverLimit) return 'text-red-600'
    if (isNearLimit) return 'text-yellow-600'
    return 'text-green-600'
  }
  
  const getStatusIcon = () => {
    if (isOverLimit) return <AlertTriangle className="w-5 h-5 text-red-500" />
    if (isNearLimit) return <TrendingUp className="w-5 h-5 text-yellow-500" />
    return <CheckCircle className="w-5 h-5 text-green-500" />
  }
  
  const getProgressBarColor = () => {
    if (isOverLimit) return 'bg-red-500'
    if (isNearLimit) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Your Usage</h3>
            <p className="text-sm text-gray-500">{planName} Plan</p>
          </div>
        </div>
        {getStatusIcon()}
      </div>

      {/* Usage Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Bid Orders: {currentForms}/{planLimit} used
          </span>
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {Math.min(100, Math.round(usagePercentage))}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
            style={{ width: `${Math.min(100, usagePercentage)}%` }}
          />
        </div>
      </div>

      {/* Status Messages */}
      <div className="space-y-3">
        {!isOverLimit && !isNearLimit && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Within subscription limits</span>
          </div>
        )}

        {isNearLimit && (
          <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">
              Next resource usage will incur 5% service fee
            </span>
          </div>
        )}

        {isOverLimit && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {formsWithFee} extra resource{formsWithFee > 1 ? 's' : ''} with 5% service fee
              </span>
            </div>
            <div className="text-xs text-gray-500 px-3">
              Extra resources beyond subscription limits incur 5% service fee
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Button */}
      {(isNearLimit || isOverLimit) && onUpgrade && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>
              {isOverLimit ? 'Save money: Upgrade Plan' : 'Upgrade Plan'}
            </span>
          </button>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 space-y-1">
          <p>💡 <strong>How it works:</strong></p>
          <p>• Orders within subscription: <span className="text-green-600 font-medium">Included in plan</span></p>
          <p>• Extra resources: <span className="text-red-600 font-medium">5% service fee</span> on transactions</p>
          <p>• Upgrade anytime for more included resources</p>
        </div>
      </div>
    </div>
  )
}