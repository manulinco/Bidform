/**
 * BidForm Widget - 嵌入式出价组件
 * 版本: 1.0.0
 * 使用方法: 
 * 1. 引入此脚本
 * 2. 调用 BidForm.init(options)
 */

(function(window, document) {
  'use strict';

  // 防止重复加载
  if (window.BidForm) {
    return;
  }

  const BidForm = {
    version: '1.0.0',
    baseUrl: window.location.origin.includes('localhost') 
      ? 'http://localhost:5173' 
      : 'https://bidform.online',

    // 初始化组件
    init: function(options) {
      const config = this.validateOptions(options);
      if (!config) return;

      const container = document.getElementById(config.containerId);
      if (!container) {
        console.error('BidForm: Container element not found:', config.containerId);
        return;
      }

      this.render(container, config);
    },

    // 验证配置参数
    validateOptions: function(options) {
      if (!options) {
        console.error('BidForm: Options are required');
        return null;
      }

      const required = ['containerId', 'formId', 'title', 'price'];
      for (let field of required) {
        if (!options[field]) {
          console.error(`BidForm: Missing required option: ${field}`);
          return null;
        }
      }

      return {
        containerId: options.containerId,
        formId: options.formId,
        merchantId: options.merchantId || '',
        title: options.title,
        price: parseFloat(options.price),
        currency: options.currency || 'CNY',
        theme: options.theme || '#7C3AED',
        minBidRatio: options.minBidRatio || 70,
        depositPercentage: options.depositPercentage || 10,
        allowMessage: options.allowMessage !== false
      };
    },

    // 渲染组件
    render: function(container, config) {
      const widgetHtml = this.generateHTML(config);
      container.innerHTML = widgetHtml;
      
      // 添加样式
      this.injectStyles();
      
      // 绑定事件
      this.bindEvents(container, config);
    },

    // 生成HTML结构
    generateHTML: function(config) {
      const minBidAmount = Math.ceil(config.price * config.minBidRatio / 100);
      const depositAmount = Math.ceil(config.price * config.depositPercentage / 100);

      return `
        <div class="bidform-widget" data-form-id="${config.formId}">
          <div class="bidform-header">
            <h3 class="bidform-title">${config.title}</h3>
            <div class="bidform-price">
              <span class="bidform-currency">${config.currency}</span>
              <span class="bidform-amount">${config.price.toLocaleString()}</span>
            </div>
          </div>
          
          <div class="bidform-content">
            <div class="bidform-info">
              <div class="bidform-info-item">
                <span class="bidform-label">最低出价</span>
                <span class="bidform-value">${config.currency} ${minBidAmount.toLocaleString()}</span>
              </div>
              <div class="bidform-info-item">
                <span class="bidform-label">定金比例</span>
                <span class="bidform-value">${config.depositPercentage}%</span>
              </div>
            </div>

            <form class="bidform-form" id="bidform-${config.formId}">
              <div class="bidform-field">
                <label class="bidform-field-label">您的出价 (${config.currency})</label>
                <input 
                  type="number" 
                  class="bidform-input" 
                  name="bidAmount"
                  min="${minBidAmount}"
                  step="1"
                  placeholder="请输入出价金额"
                  required
                />
                <div class="bidform-hint">最低出价: ${config.currency} ${minBidAmount.toLocaleString()}</div>
              </div>

              <div class="bidform-field">
                <label class="bidform-field-label">您的姓名</label>
                <input 
                  type="text" 
                  class="bidform-input" 
                  name="buyerName"
                  placeholder="请输入您的姓名"
                  required
                />
              </div>

              <div class="bidform-field">
                <label class="bidform-field-label">联系邮箱</label>
                <input 
                  type="email" 
                  class="bidform-input" 
                  name="buyerEmail"
                  placeholder="your@email.com"
                  required
                />
              </div>

              ${config.allowMessage ? `
                <div class="bidform-field">
                  <label class="bidform-field-label">留言 (可选)</label>
                  <textarea 
                    class="bidform-textarea" 
                    name="message"
                    placeholder="向卖家说点什么..."
                    rows="3"
                  ></textarea>
                </div>
              ` : ''}

              <div class="bidform-deposit-info">
                <div class="bidform-deposit-text">
                  <span class="bidform-deposit-label">需支付定金:</span>
                  <span class="bidform-deposit-amount" id="deposit-amount-${config.formId}">
                    ${config.currency} ${depositAmount.toLocaleString()}
                  </span>
                </div>
                <div class="bidform-deposit-note">
                  出价成功后支付 ${config.depositPercentage}% 定金锁定，商家接受后支付剩余金额
                </div>
              </div>

              <button 
                type="submit" 
                class="bidform-submit-btn"
                style="background-color: ${config.theme}"
              >
                <span class="bidform-btn-text">立即出价</span>
                <span class="bidform-btn-loading" style="display: none;">
                  <span class="bidform-spinner"></span>
                  处理中...
                </span>
              </button>

              <div class="bidform-terms">
                <label class="bidform-checkbox">
                  <input type="checkbox" name="agreeTerms" required />
                  <span class="bidform-checkmark"></span>
                  我同意 <a href="${this.baseUrl}/terms" target="_blank">服务条款</a> 和 <a href="${this.baseUrl}/privacy" target="_blank">隐私政策</a>
                </label>
              </div>
            </form>
          </div>

          <div class="bidform-footer">
            <div class="bidform-powered">
              Powered by <a href="${this.baseUrl}" target="_blank">BidForm</a>
            </div>
          </div>
        </div>
      `;
    },

    // 注入样式
    injectStyles: function() {
      if (document.getElementById('bidform-styles')) {
        return; // 样式已存在
      }

      const styles = `
        .bidform-widget {
          max-width: 400px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow: hidden;
        }

        .bidform-header {
          padding: 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
        }

        .bidform-title {
          margin: 0 0 12px 0;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.4;
        }

        .bidform-price {
          font-size: 24px;
          font-weight: 700;
        }

        .bidform-currency {
          font-size: 16px;
          opacity: 0.9;
          margin-right: 4px;
        }

        .bidform-content {
          padding: 24px;
        }

        .bidform-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
        }

        .bidform-info-item {
          text-align: center;
        }

        .bidform-label {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .bidform-value {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .bidform-field {
          margin-bottom: 20px;
        }

        .bidform-field-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }

        .bidform-input, .bidform-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }

        .bidform-input:focus, .bidform-textarea:focus {
          outline: none;
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }

        .bidform-hint {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }

        .bidform-deposit-info {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          border: 1px solid #f59e0b;
        }

        .bidform-deposit-text {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .bidform-deposit-label {
          font-size: 14px;
          color: #92400e;
          font-weight: 500;
        }

        .bidform-deposit-amount {
          font-size: 16px;
          font-weight: 700;
          color: #92400e;
        }

        .bidform-deposit-note {
          font-size: 12px;
          color: #a16207;
          line-height: 1.4;
        }

        .bidform-submit-btn {
          width: 100%;
          padding: 14px 24px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          margin-bottom: 16px;
        }

        .bidform-submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .bidform-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .bidform-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: bidform-spin 1s linear infinite;
          margin-right: 8px;
        }

        @keyframes bidform-spin {
          to { transform: rotate(360deg); }
        }

        .bidform-terms {
          margin-bottom: 16px;
        }

        .bidform-checkbox {
          display: flex;
          align-items: flex-start;
          font-size: 12px;
          color: #6b7280;
          cursor: pointer;
          line-height: 1.4;
        }

        .bidform-checkbox input {
          margin-right: 8px;
          margin-top: 2px;
        }

        .bidform-checkbox a {
          color: #7c3aed;
          text-decoration: none;
        }

        .bidform-checkbox a:hover {
          text-decoration: underline;
        }

        .bidform-footer {
          padding: 16px 24px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }

        .bidform-powered {
          font-size: 12px;
          color: #6b7280;
        }

        .bidform-powered a {
          color: #7c3aed;
          text-decoration: none;
          font-weight: 500;
        }

        .bidform-powered a:hover {
          text-decoration: underline;
        }

        /* 响应式设计 */
        @media (max-width: 480px) {
          .bidform-widget {
            max-width: 100%;
            margin: 0;
            border-radius: 0;
          }
          
          .bidform-info {
            flex-direction: column;
            gap: 12px;
          }
        }
      `;

      const styleSheet = document.createElement('style');
      styleSheet.id = 'bidform-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    },

    // 绑定事件
    bindEvents: function(container, config) {
      const form = container.querySelector(`#bidform-${config.formId}`);
      const bidAmountInput = form.querySelector('input[name="bidAmount"]');
      const depositAmountSpan = container.querySelector(`#deposit-amount-${config.formId}`);

      // 实时计算定金
      bidAmountInput.addEventListener('input', function() {
        const bidAmount = parseFloat(this.value) || 0;
        const depositAmount = Math.ceil(bidAmount * config.depositPercentage / 100);
        depositAmountSpan.textContent = `${config.currency} ${depositAmount.toLocaleString()}`;
      });

      // 表单提交
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit(form, config);
      });
    },

    // 处理表单提交
    handleSubmit: function(form, config) {
      const formData = new FormData(form);
      const data = {
        formId: config.formId,
        merchantId: config.merchantId,
        bidAmount: parseFloat(formData.get('bidAmount')),
        buyerName: formData.get('buyerName'),
        buyerEmail: formData.get('buyerEmail'),
        message: formData.get('message') || '',
        agreeTerms: formData.get('agreeTerms') === 'on'
      };

      // 验证数据
      if (!this.validateSubmission(data, config)) {
        return;
      }

      // 显示加载状态
      this.setLoading(form, true);

      // 提交到BidForm API
      this.submitBid(data, config)
        .then(response => {
          if (response.success) {
            this.showSuccess(form, response.data);
          } else {
            this.showError(form, response.error.message);
          }
        })
        .catch(error => {
          this.showError(form, '提交失败，请稍后重试');
          console.error('BidForm submission error:', error);
        })
        .finally(() => {
          this.setLoading(form, false);
        });
    },

    // 验证提交数据
    validateSubmission: function(data, config) {
      const minBidAmount = Math.ceil(config.price * config.minBidRatio / 100);
      
      if (data.bidAmount < minBidAmount) {
        alert(`出价不能低于 ${config.currency} ${minBidAmount.toLocaleString()}`);
        return false;
      }

      if (!data.agreeTerms) {
        alert('请同意服务条款和隐私政策');
        return false;
      }

      return true;
    },

    // 提交出价
    submitBid: async function(data, config) {
      const response = await fetch(`${this.baseUrl}/api/offers/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form_id: data.formId,
          bid_amount: data.bidAmount,
          buyer_name: data.buyerName,
          buyer_email: data.buyerEmail,
          buyer_message: data.message,
          agree_terms: data.agreeTerms
        })
      });

      return await response.json();
    },

    // 设置加载状态
    setLoading: function(form, loading) {
      const btn = form.querySelector('.bidform-submit-btn');
      const btnText = btn.querySelector('.bidform-btn-text');
      const btnLoading = btn.querySelector('.bidform-btn-loading');

      btn.disabled = loading;
      btnText.style.display = loading ? 'none' : 'inline';
      btnLoading.style.display = loading ? 'inline-flex' : 'none';
    },

    // 显示成功消息
    showSuccess: function(form, data) {
      const widget = form.closest('.bidform-widget');
      widget.innerHTML = `
        <div style="padding: 40px 24px; text-align: center;">
          <div style="width: 64px; height: 64px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
            <svg width="32" height="32" fill="white" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
          <h3 style="margin: 0 0 8px; color: #1f2937; font-size: 18px; font-weight: 600;">出价提交成功！</h3>
          <p style="margin: 0 0 24px; color: #6b7280; font-size: 14px;">请支付定金以锁定您的出价</p>
          <button onclick="window.open('${this.baseUrl}/payment/${data.offer_id}', '_blank')" 
                  style="background: #7c3aed; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;">
            立即支付定金
          </button>
        </div>
      `;
    },

    // 显示错误消息
    showError: function(form, message) {
      alert(message);
    }
  };

  // 暴露到全局
  window.BidForm = BidForm;

  // 自动初始化（如果页面中有data-属性）
  document.addEventListener('DOMContentLoaded', function() {
    const scripts = document.querySelectorAll('script[data-form-id]');
    scripts.forEach(script => {
      const options = {
        containerId: script.getAttribute('data-container') || 'bidform-widget',
        formId: script.getAttribute('data-form-id'),
        merchantId: script.getAttribute('data-merchant'),
        title: script.getAttribute('data-title'),
        price: script.getAttribute('data-price'),
        currency: script.getAttribute('data-currency') || 'CNY',
        theme: script.getAttribute('data-theme') || '#7C3AED',
        minBidRatio: parseInt(script.getAttribute('data-min-bid-ratio')) || 70,
        depositPercentage: parseInt(script.getAttribute('data-deposit-percentage')) || 10
      };

      if (options.formId && options.title && options.price) {
        BidForm.init(options);
      }
    });
  });

})(window, document);