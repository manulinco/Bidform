import { BidForm, CreateBidFormData } from '../types';

// 本地存储的键名
const STORAGE_KEY = 'bidform_products';

// 生成简单的 UUID
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 获取当前时间戳
function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// 从 localStorage 获取产品列表
export function getStoredProducts(): BidForm[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

// 保存产品到 localStorage
export function saveProductToStorage(formData: CreateBidFormData): BidForm {
  const products = getStoredProducts();
  
  const newProduct: BidForm = {
    id: generateId(),
    title: formData.title,
    description: formData.description || null,
    starting_price: formData.starting_price,
    currency: formData.currency || 'USD',
    deposit_percentage: formData.deposit_percentage || 10,
    minimum_bid_ratio: formData.minimum_bid_ratio || 70,
    theme_color: formData.theme_color || '#ee5e3a',
    allow_messages: formData.allow_messages !== false,
    status: 'active',
    created_at: getCurrentTimestamp(),
    updated_at: getCurrentTimestamp(),
    user_id: 'local-user', // 本地存储使用固定用户ID
    total_bids: 0,
    highest_bid: 0
  };
  
  products.unshift(newProduct); // 添加到开头
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    console.log('✅ Product saved to localStorage:', newProduct);
    return newProduct;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw new Error('Failed to save product locally');
  }
}

// 更新产品
export function updateStoredProduct(id: string, updates: Partial<BidForm>): BidForm | null {
  const products = getStoredProducts();
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return null;
  }
  
  products[index] = {
    ...products[index],
    ...updates,
    updated_at: getCurrentTimestamp()
  };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return products[index];
  } catch (error) {
    console.error('Error updating localStorage:', error);
    throw new Error('Failed to update product locally');
  }
}

// 删除产品
export function deleteStoredProduct(id: string): boolean {
  const products = getStoredProducts();
  const filteredProducts = products.filter(p => p.id !== id);
  
  if (filteredProducts.length === products.length) {
    return false; // 没有找到要删除的产品
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts));
    return true;
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
    throw new Error('Failed to delete product locally');
  }
}

// 获取单个产品
export function getStoredProduct(id: string): BidForm | null {
  const products = getStoredProducts();
  return products.find(p => p.id === id) || null;
}

// 清空所有产品（用于测试）
export function clearStoredProducts(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ All stored products cleared');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}