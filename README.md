# 🎯 BidForm.online

> **Turn Every Offer Into a Sale with Embedded Bid Forms**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern SaaS platform that allows merchants to embed bid forms on any website with automatic split payments. **No coding required, no payment license needed.**

## 🚀 Live Demo

🌐 **[Try BidForm.online →](https://bidform.online)**

## ✨ Key Features

### 🔧 **No Coding Required**
Embed in any website with a single line of code - works with Shopify, WooCommerce, Wix, Squarespace, or custom sites.

### ⚡ **Automatic Split Payments** 
Get paid instantly via Stripe Connect with automatic 10% deposit + 90% balance workflow.

### 👥 **Seller Control**
Choose winning offers based on your criteria - highest price, quantity, loyalty, or efficiency.

### 💰 **Flexible Pricing**
- **Free Plan**: 5% service fee
- **Basic Plan**: $19.9/month, 0% service fee
- **Pro Plan**: $199/month, enterprise features

### 🔒 **Secure & Compliant**
Bank-level security with PCI DSS compliance. No payment license required.

## 🎯 Perfect Use Cases

- 🎨 **Fine art and collectibles bidding**
- 🏷️ **Limited-edition product pre-sales**  
- 💎 **Rare item marketplace**
- 🌍 **Cross-border flexible pricing**
- 🛍️ **Any business accepting offers vs fixed prices**

## 🚀 Quick Start

### 1. **Embed Widget** (30 seconds)
```html
<script src="https://cdn.bidform.online/widget.js"
  data-merchant="your_id"
  data-product="vintage-watch"
  data-title="Vintage Rolex"
  data-price="2500"
  async></script>
<div id="bid-widget"></div>
```

### 2. **Receive Offers**
Buyers submit price, quantity, and 10% deposit automatically.

### 3. **Select Winners & Get Paid**
Accept offers, deduct inventory, complete payment automatically.

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Payments**: Stripe + Stripe Connect
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Build Tool**: Vite
- **Deployment**: Vercel/Netlify ready

## 📦 Installation & Development

```bash
# Clone the repository
git clone https://github.com/manulinco/bidform.git
cd bidform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase and Stripe credentials

# Start development server
npm run dev
```

## 🔧 Environment Setup

### Required Environment Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe Configuration  
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Database Setup (Supabase)

1. Create a new Supabase project
2. Run the SQL schema (see `DEPLOYMENT.md`)
3. Configure OAuth providers (Google, Microsoft)
4. Get your API keys

### Payment Setup (Stripe)

1. Create Stripe account
2. Get API keys from dashboard
3. Set up webhooks for payment events
4. Configure Stripe Connect for marketplace

## 🚀 Deployment

### Quick Deploy Options

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/manulinco/bidform)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/manulinco/bidform)

### Manual Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to your preferred platform
# See DEPLOYMENT.md for detailed guides
```

## 📖 Documentation

- 📋 **[Deployment Guide](./DEPLOYMENT.md)** - Detailed setup instructions
- 🔧 **[API Documentation](./docs/api.md)** - Widget API reference
- 💡 **[Examples](./examples/)** - Integration examples
- ❓ **[FAQ](./docs/faq.md)** - Frequently asked questions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes
# Commit your changes
git commit -m 'Add amazing feature'

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Stripe](https://stripe.com) for payment processing
- [Supabase](https://supabase.com) for backend infrastructure
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide](https://lucide.dev) for beautiful icons

## 📞 Support

- 📧 **Email**: support@bidform.online
- 💬 **Discord**: [Join our community](https://discord.gg/bidform)
- 🐛 **Issues**: [GitHub Issues](https://github.com/manulinco/bidform/issues)
- 📖 **Docs**: [Documentation](https://docs.bidform.online)

---

<div align="center">

**[🌐 Visit BidForm.online](https://bidform.online)** • **[📚 Documentation](https://docs.bidform.online)** • **[💬 Community](https://discord.gg/bidform)**

Made with ❤️ by the BidForm team

</div>