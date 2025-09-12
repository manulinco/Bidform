import { loadStripe } from '@stripe/stripe-js'

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = (stripeKey && stripeKey !== 'pk_test_...') 
  ? loadStripe(stripeKey)
  : Promise.resolve(null)

export { stripePromise }

export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  // For MVP, we'll use a simple fee structure
  PLATFORM_FEE_PERCENTAGE: 5, // 5% for free tier
  PREPAYMENT_PERCENTAGE: 10, // 10% prepayment
  BALANCE_PERCENTAGE: 90, // 90% balance payment
}

// Helper functions for payment calculations
export const calculatePrepaymentAmount = (totalAmount: number): number => {
  return Math.round(totalAmount * (STRIPE_CONFIG.PREPAYMENT_PERCENTAGE / 100))
}

export const calculateBalanceAmount = (totalAmount: number): number => {
  return Math.round(totalAmount * (STRIPE_CONFIG.BALANCE_PERCENTAGE / 100))
}

export const calculatePlatformFee = (amount: number, tier: 'free' | 'basic' | 'pro'): number => {
  if (tier === 'free') {
    return Math.round(amount * (STRIPE_CONFIG.PLATFORM_FEE_PERCENTAGE / 100))
  }
  return 0 // No platform fee for paid tiers
}