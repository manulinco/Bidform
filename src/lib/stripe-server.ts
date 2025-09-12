// Stripe服务端配置
// 注意：这个文件包含服务端密钥，仅用于后端API

import Stripe from 'stripe';

// 从环境变量获取Stripe密钥
const stripeSecretKey = import.meta.env.VITE_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn('Stripe密钥未配置，支付功能将不可用');
}

// 创建Stripe实例
export const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
  typescript: true,
}) : null;

// 导出Stripe类型
export type { Stripe };

// Webhook签名验证
export const verifyWebhookSignature = (
  payload: string | Buffer,
  signature: string,
  endpointSecret: string
): Stripe.Event => {
  if (!stripe) {
    throw new Error('Stripe未初始化');
  }
  
  return stripe.webhooks.constructEvent(payload, signature, endpointSecret);
};

// 创建Stripe Connect账户
export const createConnectAccount = async (email: string, country: string = 'US'): Promise<Stripe.Account> => {
  if (!stripe) {
    throw new Error('Stripe未初始化');
  }

  return await stripe.accounts.create({
    type: 'express',
    country,
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
};

// 创建账户链接
export const createAccountLink = async (
  accountId: string,
  refreshUrl: string,
  returnUrl: string
): Promise<Stripe.AccountLink> => {
  if (!stripe) {
    throw new Error('Stripe未初始化');
  }

  return await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  });
};

// 获取账户信息
export const getAccountInfo = async (accountId: string): Promise<Stripe.Account> => {
  if (!stripe) {
    throw new Error('Stripe未初始化');
  }

  return await stripe.accounts.retrieve(accountId);
};

// 创建产品
export const createProduct = async (name: string, description?: string): Promise<Stripe.Product> => {
  if (!stripe) {
    throw new Error('Stripe未初始化');
  }

  return await stripe.products.create({
    name,
    description,
  });
};

// 创建价格
export const createPrice = async (
  productId: string,
  amount: number,
  currency: string = 'usd'
): Promise<Stripe.Price> => {
  if (!stripe) {
    throw new Error('Stripe未初始化');
  }

  return await stripe.prices.create({
    product: productId,
    unit_amount: Math.round(amount * 100),
    currency: currency.toLowerCase(),
  });
};

// 获取余额
export const getBalance = async (accountId?: string): Promise<Stripe.Balance> => {
  if (!stripe) {
    throw new Error('Stripe未初始化');
  }

  const options = accountId ? { stripeAccount: accountId } : {};
  return await stripe.balance.retrieve(options);
};

// 获取交易记录
export const getTransactions = async (
  accountId?: string,
  limit: number = 10
): Promise<Stripe.BalanceTransaction[]> => {
  if (!stripe) {
    throw new Error('Stripe未初始化');
  }

  const options = accountId ? { stripeAccount: accountId } : {};
  const transactions = await stripe.balanceTransactions.list({ limit }, options);
  return transactions.data;
};