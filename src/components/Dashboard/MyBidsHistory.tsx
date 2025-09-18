

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoStore } from '../../stores/demoStore';

interface MyBid {
  id: string;
  productId: string; // 添加产品ID字段
  productName: string;
  productImage: string;
  bidAmount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  submittedAt: string;
  message?: string;
}

export const MyBidsHistory: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [myBids, setMyBids] = useState<MyBid[]>([]);

  useEffect(() => {
    // 模拟获取用户的出价历史
    const mockBids: MyBid[] = [
      {
        id: 'my-bid-1',
        productId: 'demo-vintage-car',
        productName: '1985年保时捷911经典跑车',
        productImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
        bidAmount: 180000,
        status: 'pending',
        submittedAt: '2025/9/17 19:13:08',
        message: '我对这辆经典跑车很感兴趣，希望能够成交。'
      },
      {
        id: 'my-bid-2',
        productId: 'demo-vintage-watch',
        productName: '1960年代劳力士古董腕表',
        productImage: 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?q=80&w=1200&auto=format&fit=crop',
        bidAmount: 25000,
        status: 'accepted',
        submittedAt: '2025/9/15 22:13:08',
        message: '这块表的品相很好，我很满意。'
      },
      {
        id: 'my-bid-3',
        productId: 'demo-art-painting',
        productName: '现代抽象油画作品',
        productImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
        bidAmount: 8500,
        status: 'rejected',
        submittedAt: '2025/9/14 15:30:22',
        message: '希望能够收藏这件珍品。'
      },
      {
        id: 'my-bid-4',
        productId: 'demo-art-painting',
        productName: '现代抽象油画作品',
        productImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
        bidAmount: 7200,
        status: 'accepted',
        submittedAt: '2025/9/12 10:45:15',
        message: '非常喜欢这幅作品的艺术价值。'
      },
      {
        id: 'my-bid-5',
        productId: 'demo-vintage-watch',
        productName: '1960年代劳力士古董腕表',
        productImage: 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?q=80&w=1200&auto=format&fit=crop',
        bidAmount: 22000,
        status: 'expired',
        submittedAt: '2025/9/10 14:20:30',
        message: '这块表的收藏价值很高。'
      }
    ];
    setMyBids(mockBids);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '等待回复';
      case 'accepted': return '已接受';
      case 'rejected': return '已拒绝';
      case 'expired': return '已过期';
      default: return '未知';
    }
  };

  const filteredBids = myBids.filter((bid) => {
    if (filter === 'all') return true;
    return bid.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">我的出价历史</h1>
        <div className="text-sm text-gray-600">
          共 {myBids.length} 条记录
        </div>
      </div>

      {/* 筛选按钮 */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: '全部', count: myBids.length },
          { key: 'pending', label: '等待回复', count: myBids.filter(b => b.status === 'pending').length },
          { key: 'accepted', label: '已接受', count: myBids.filter(b => b.status === 'accepted').length },
          { key: 'rejected', label: '已拒绝', count: myBids.filter(b => b.status === 'rejected').length }
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* 出价列表 */}
      {filteredBids.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'all' ? '暂无出价记录' : `暂无${filter === 'pending' ? '等待回复的' : filter === 'accepted' ? '已接受的' : '已拒绝的'}出价`}
          </h3>
          <p className="text-gray-600">
            {filter === 'all' ? '您还没有提交过任何出价' : '切换到其他筛选条件查看更多记录'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBids.map((bid) => (
            <div key={bid.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* 产品图片 */}
                  <img
                    src={bid.productImage}
                    alt={bid.productName}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  {/* 出价信息 */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {bid.productName}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bid.status)}`}>
                        {getStatusText(bid.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-gray-500">出价金额</span>
                        <p className="text-xl font-bold text-blue-600">
                          ¥{bid.bidAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">提交时间</span>
                        <p className="text-sm text-gray-900">
                          {new Date(bid.submittedAt).toLocaleString('zh-CN')}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">出价ID</span>
                        <p className="text-sm text-gray-600 font-mono">
                          {bid.id}
                        </p>
                      </div>
                    </div>
                    
                    {bid.message && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-500">留言</span>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">
                          {bid.message}
                        </p>
                      </div>
                    )}
                    
                    {/* 操作按钮 */}
                    <div className="flex gap-2">
                      {bid.status === 'pending' && (
                        <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                          撤回出价
                        </button>
                      )}
                      {bid.status === 'accepted' && (
                        <button 
                          onClick={() => navigate(`/transaction/${bid.id}`)}
                          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          查看交易详情
                        </button>
                      )}
                      <button 
                        onClick={() => navigate(`/bid/${bid.productId}`)}
                        className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        查看产品详情
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 统计信息 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{myBids.length}</div>
          <div className="text-sm text-blue-700">总出价次数</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {myBids.filter(b => b.status === 'pending').length}
          </div>
          <div className="text-sm text-yellow-700">等待回复</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {myBids.filter(b => b.status === 'accepted').length}
          </div>
          <div className="text-sm text-green-700">成功出价</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            ¥{myBids.filter(b => b.status === 'accepted').reduce((sum, b) => sum + b.bidAmount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-purple-700">成交总额</div>
        </div>
      </div>
    </div>
  );
};