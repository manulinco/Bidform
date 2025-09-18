import React from 'react'
import { Plus, Minus, RotateCcw } from 'lucide-react'

interface UsageTestControlsProps {
  currentForms: number
  onAddForm: () => void
  onRemoveForm: () => void
  onReset: () => void
}

// Helper function to set a specific test value
const setTestValue = (target: number, current: number, addFn: () => void, removeFn: () => void) => {
  if (target > current) {
    for (let i = current; i < target; i++) {
      addFn()
    }
  } else if (target < current) {
    for (let i = current; i > target; i--) {
      removeFn()
    }
  }
}

export const UsageTestControls: React.FC<UsageTestControlsProps> = ({
  currentForms,
  onAddForm,
  onRemoveForm,
  onReset
}) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-yellow-800 mb-1">
            🧪 Test Usage Scenarios
          </h3>
          <p className="text-xs text-yellow-700">
            Simulate different usage levels to test the pricing display
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onRemoveForm}
            disabled={currentForms <= 0}
            className="w-8 h-8 bg-red-100 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 text-red-600 rounded-lg flex items-center justify-center transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
            {currentForms} forms
          </span>
          
          <button
            onClick={onAddForm}
            className="w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg flex items-center justify-center transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          
          <button
            onClick={onReset}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center transition-colors ml-2"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={onReset}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
        >
          Reset (0)
        </button>
        
        <button
          onClick={() => {
            // 设置为安全范围
            const target = 3
            setTestValue(target, currentForms, onAddForm, onRemoveForm)
          }}
          className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-full transition-colors"
        >
          Safe (3)
        </button>
        
        <button
          onClick={() => {
            // 设置为接近限制 (Free plan: 5)
            const target = 5
            setTestValue(target, currentForms, onAddForm, onRemoveForm)
          }}
          className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded-full transition-colors"
        >
          At Free Limit (5)
        </button>
        
        <button
          onClick={() => {
            // 设置为超出免费限制
            const target = 8
            setTestValue(target, currentForms, onAddForm, onRemoveForm)
          }}
          className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-full transition-colors"
        >
          Over Free (8)
        </button>
        
        <button
          onClick={() => {
            // 设置为 Starter 计划限制
            const target = 200
            setTestValue(target, currentForms, onAddForm, onRemoveForm)
          }}
          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-full transition-colors"
        >
          Starter Limit (200)
        </button>
        
        <button
          onClick={() => {
            // 设置为超出 Starter，需要 Pro
            const target = 250
            setTestValue(target, currentForms, onAddForm, onRemoveForm)
          }}
          className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-full transition-colors"
        >
          Need Pro (250)
        </button>
      </div>
    </div>
  )
}