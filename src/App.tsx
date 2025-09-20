import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import { SimpleAuth } from './components/Auth/SimpleAuth';
import { Dashboard } from './components/Dashboard/Dashboard';
import { MyBidsHistory } from './components/Dashboard/MyBidsHistory';
import { BuyerDashboard } from './components/BuyerDashboard/BuyerDashboard';
import { ProductDetail } from './components/ProductDetail/ProductDetail';
import { TransactionDetail } from './components/TransactionDetail/TransactionDetail';
import { TestPage } from './components/TestPage';
import { DemoPage } from './components/DemoPage';
import { BidPage } from './components/BidPage/BidPage';
import { SharePage } from './components/ShareCard/SharePage';
import { Helmet } from 'react-helmet';
import ErrorBoundary from './components/ErrorBoundary';
import { 
  Code2, 
  Zap, 
  Shield, 
  Globe, 
  CreditCard, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Menu, 
  X,
  Play,
  Star,
  DollarSign,
  Layers,
  Lock,
  Smartphone,
  BarChart3,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  Github,
  Twitter,
  ChevronDown,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';

function App() {
  const { user, loading, initialize } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const HomePage = () => (
    <>
      <Helmet>
        <title>BidForm.online - Embed Bid Forms Anywhere</title>
        <meta name="description" content="The easiest way to add bid functionality to any website. One line of code, unlimited possibilities." />
      </Helmet>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg mr-3"></div>
                <span className="text-xl font-bold text-gray-900">BidForm.online</span>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Features</a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Pricing</a>
                <a href="#demo" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Demo</a>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105"
                >
                  Get Started
                </button>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <a href="#features" className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium">Pricing</a>
              <a href="#demo" className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium">Demo</a>
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full text-left bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 text-base font-medium rounded-lg mt-2"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Now with Stripe integration
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Embed Bid Forms
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Anywhere
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              The easiest way to add bid functionality to any website. One line of code, unlimited possibilities. Perfect for luxury goods, art, limited items, virtual products, and high-value sales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Start Building Free
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
              <a
                href="#demo"
                className="flex items-center text-gray-600 hover:text-gray-900 px-6 py-4 text-lg font-medium transition-colors"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </a>
            </div>
          </div>

          {/* Code Example */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <button
                  onClick={() => copyToClipboard('<script src="https://bidform.online/embed.js" data-product-id="your-id"></script>')}
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  {copiedCode ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copiedCode ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="text-green-400 text-sm md:text-base overflow-x-auto">
                <code>{`<script src="https://bidform.online/embed.js" 
        data-product-id="your-id">
</script>`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              See it in action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch how easy it is to embed a bid form and start accepting offers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Add the script tag</h3>
                    <p className="text-gray-600">Simply paste our embed code into your HTML</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Configure your product</h3>
                    <p className="text-gray-600">Set up your product details and pricing in our dashboard</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Start receiving bids</h3>
                    <p className="text-gray-600">Customers can now make offers directly on your site</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="bg-white border-2 border-purple-200 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl mr-4 flex items-center justify-center">
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Vintage Rolex</h3>
                    <p className="text-gray-600 font-semibold">$2,500.00</p>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg">
                  Make an Offer
                </button>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Powered by BidForm
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need for bid-based selling
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From simple embedding to advanced payment workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "One-Line Integration",
                description: "Add bid functionality with just a single script tag. No complex setup required."
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure Payments",
                description: "Built-in Stripe integration ensures secure payment processing for all transactions."
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "Mobile Responsive",
                description: "Bid forms automatically adapt to any screen size for optimal user experience."
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Real-time Analytics",
                description: "Track bid performance, conversion rates, and revenue in your dashboard."
              },
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: "Bid Management",
                description: "Accept, reject, or counter bids with our intuitive management interface."
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Price Optimization",
                description: "Bidding typically generates 15-30% higher prices than fixed pricing, maximizing item value."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $0<span className="text-lg text-gray-600 font-normal">/month</span>
                </div>
                <p className="text-gray-600">Perfect for getting started</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Up to 100 bids/month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Basic analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Email support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Standard payment processing</span>
                </li>
              </ul>
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 shadow-xl text-white relative">
              <div className="absolute top-4 right-4">
                <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-bold">
                  Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-2">
                  $29<span className="text-lg font-normal opacity-80">/month</span>
                </div>
                <p className="opacity-80">For growing businesses</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-3" />
                  <span>Up to 1,000 bids/month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-3" />
                  <span>Advanced analytics & reporting</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-3" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-3" />
                  <span>Custom branding</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-3" />
                  <span>API access</span>
                </li>
              </ul>
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full bg-white text-purple-600 hover:bg-gray-50 py-3 px-6 rounded-xl font-semibold transition-colors"
              >
                Start Pro Trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $99<span className="text-lg text-gray-600 font-normal">/month</span>
                </div>
                <p className="text-gray-600">For large-scale operations</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Unlimited bids</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">White-label solution</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">24/7 dedicated support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">SLA guarantee</span>
                </li>
              </ul>
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MessageSquare className="w-4 h-4 mr-2" />
              Got Questions?
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about BidForm.online
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                icon: <Target className="w-6 h-6" />,
                question: "What problem does BidForm.online solve?",
                answer: "Traditional e-commerce only allows fixed pricing, but many products (like luxury goods, art, custom services) are better suited for bidding. BidForm lets any website easily add bidding functionality, helping sellers achieve higher revenue and buyers get items at their preferred price point."
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                question: "What advantages does this have over fixed pricing?",
                answer: "Bidding allows scarce items to sell for higher prices while creating an engaging 'treasure hunt' experience for buyers. It's especially suitable for limited items, luxury goods, art collectibles, and custom services. Data shows bidding typically generates 15-30% higher prices than fixed pricing."
              },
              {
                icon: <Zap className="w-6 h-6" />,
                question: "How simple is the integration?",
                answer: "Just one line of code! Copy our script tag to your webpage and set the product ID. No complex backend development needed, no new APIs to learn - you can have bidding functionality on your site within 5 minutes."
              },
              {
                icon: <Shield className="w-6 h-6" />,
                question: "Is payment secure?",
                answer: "We use Stripe to process all payments, one of the world's most secure payment platforms. Buyer information and payment data are encrypted and PCI DSS compliant. Seller funds go directly to your Stripe account."
              },
              {
                icon: <Star className="w-6 h-6" />,
                question: "What are the free version limitations?",
                answer: "The free version supports up to 100 bids per month, includes basic analytics and email support. This is sufficient for most small sellers. Upgrading to paid plans gives you more bids, advanced analytics, priority support, and additional features."
              },
              {
                icon: <Lock className="w-6 h-6" />,
                question: "How do you prevent malicious bidding?",
                answer: "We have multiple protection mechanisms: identity verification, payment method verification, behavior analysis, and blacklist systems. Malicious users are automatically identified and blocked. You can also set minimum bid increments and reserve prices."
              },
              {
                icon: <Globe className="w-6 h-6" />,
                question: "What types of products work best?",
                answer: "Especially suitable for: luxury goods, art, collectibles, limited items, custom services, real estate, vehicles, virtual products (course cards, membership cards, benefit cards), digital collectibles, etc. Any product with uniqueness, scarcity, or personalized value works well with bidding."
              },
              {
                icon: <Layers className="w-6 h-6" />,
                question: "Can I customize the appearance?",
                answer: "Yes! The Pro version supports custom colors, fonts, button styles, etc., to perfectly integrate the bid form into your website design. The Enterprise version also supports complete white-label customization."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-purple-600">
                    {faq.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
              <p className="text-gray-600 mb-6">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@bidform.online"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Contact Support
                </a>
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to start accepting bids?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using BidForm to increase their sales and engage customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 rounded-xl text-lg font-semibold transition-colors shadow-lg"
            >
              Start Free Today
            </button>
            <a
              href="#demo"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
            >
              View Demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg mr-3"></div>
                <span className="text-xl font-bold">BidForm.online</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The easiest way to add bid functionality to any website. Trusted by thousands of businesses worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-6 h-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#demo" className="text-gray-400 hover:text-white transition-colors">Demo</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Docs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 BidForm.online. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Status</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
              <a href="#" className="hover:text-white transition-colors">Changelog</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/bid/:id" element={<BidPage />} />
            <Route path="/share/:id" element={<SharePage />} />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/dashboard/bids" 
              element={user ? <MyBidsHistory /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/buyer-dashboard" 
              element={user ? <BuyerDashboard /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/product/:id" 
              element={user ? <ProductDetail /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/transaction/:id" 
              element={user ? <TransactionDetail /> : <Navigate to="/" replace />} 
            />
          </Routes>

          {showLoginModal && (
            <SimpleAuth isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
          )}

          <Toaster position="top-right" />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;