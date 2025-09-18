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
  const [copied, setCopied] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const copyCode = () => {
    const code = `<script src="https://cdn.bidform.online/widget.js"
  data-merchant="your_id"
  data-product="vintage-watch"
  data-title="Vintage Rolex"
  data-price="2500"
  async></script>
<div id="bid-widget"></div>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    initialize();
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
          <Toaster position="top-right" />
          
          <Routes>
            <Route 
              path="/" 
              element={
                user ? <Navigate to="/dashboard" replace /> : <LandingPage 
                  showLoginModal={showLoginModal}
                  setShowLoginModal={setShowLoginModal}
                  isMenuOpen={isMenuOpen}
                  setIsMenuOpen={setIsMenuOpen}
                  copied={copied}
                  copyCode={copyCode}
                  activeFeature={activeFeature}
                />
              } 
            />
            <Route 
              path="/dashboard" 
              element={user ? (
                <ErrorBoundary>
                  <Dashboard />
                </ErrorBoundary>
              ) : <Navigate to="/" replace />} 
            />
            <Route 
              path="/my-bids" 
              element={user ? (
                <ErrorBoundary>
                  <MyBidsHistory />
                </ErrorBoundary>
              ) : <Navigate to="/" replace />} 
            />
            <Route 
              path="/buyer-dashboard" 
              element={user ? (
                <ErrorBoundary>
                  <BuyerDashboard />
                </ErrorBoundary>
              ) : <Navigate to="/" replace />} 
            />
            <Route 
              path="/test" 
              element={<TestPage />} 
            />
            <Route 
              path="/demo" 
              element={<DemoPage />} 
            />
            <Route 
              path="/bid/:formId" 
              element={<BidPage />} 
            />
            <Route 
              path="/share/:formId" 
              element={<SharePage />} 
            />
            <Route 
              path="/product/:id" 
              element={user ? (
                <ErrorBoundary>
                  <ProductDetail />
                </ErrorBoundary>
              ) : <Navigate to="/" replace />} 
            />
            <Route 
              path="/transaction/:id" 
              element={user ? (
                <ErrorBoundary>
                  <TransactionDetail />
                </ErrorBoundary>
              ) : <Navigate to="/" replace />} 
            />
          </Routes>
          
          <SimpleAuth 
            isOpen={showLoginModal} 
            onClose={() => setShowLoginModal(false)} 
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

interface LandingPageProps {
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  copied: boolean;
  copyCode: () => void;
  activeFeature: number;
}

const LandingPage: React.FC<LandingPageProps> = ({
  showLoginModal,
  setShowLoginModal,
  isMenuOpen,
  setIsMenuOpen,
  copied,
  copyCode,
  activeFeature
}) => {
  return (
    <>
      {/* Navigation */}
      <nav className="fixed w-full glass border-b border-white/20 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center">
              <div className="flex items-center group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <span className="ml-3 text-2xl font-black gradient-text">
                  BidForm.online
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition-all font-semibold hover:scale-105 px-3 py-2 rounded-lg hover:bg-purple-50">✨ Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-all font-semibold hover:scale-105 px-3 py-2 rounded-lg hover:bg-purple-50">💰 Pricing</a>
              <a href="#docs" className="text-gray-700 hover:text-purple-600 transition-all font-semibold hover:scale-105 px-3 py-2 rounded-lg hover:bg-purple-50">📚 Docs</a>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="text-gray-700 hover:text-purple-600 transition-all font-semibold hover:scale-105 px-3 py-2 rounded-lg hover:bg-purple-50"
              >
                🔐 Sign In
              </button>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl btn-hover-lift"
              >
                🚀 Get Started
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-purple-600 p-3 rounded-xl hover:bg-purple-50 transition-all"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden glass border-t border-white/20 shadow-xl">
            <div className="px-6 py-6 space-y-4">
              <a href="#features" className="block text-gray-700 hover:text-purple-600 font-semibold py-3 px-4 rounded-xl hover:bg-purple-50 transition-all">✨ Features</a>
              <a href="#pricing" className="block text-gray-700 hover:text-purple-600 font-semibold py-3 px-4 rounded-xl hover:bg-purple-50 transition-all">💰 Pricing</a>
              <a href="#docs" className="block text-gray-700 hover:text-purple-600 font-semibold py-3 px-4 rounded-xl hover:bg-purple-50 transition-all">📚 Docs</a>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="block w-full text-left text-gray-700 hover:text-purple-600 font-semibold py-3 px-4 rounded-xl hover:bg-purple-50 transition-all"
              >
                🔐 Sign In
              </button>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg"
              >
                🚀 Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100/80 to-pink-100/80 backdrop-blur-sm rounded-full text-purple-700 text-sm font-semibold mb-8 border border-purple-200/50 shadow-lg">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              🚀 Accept bids on any website
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Embed bid forms with
              <span className="block gradient-text animate-pulse-slow">
                one line of code
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              💰 Handle 10% deposits and 90% balance payments automatically. <br/>
              ⚡ Split payouts with Stripe Connect. No escrow, no complexity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button 
                onClick={() => setShowLoginModal(true)}
                className="group bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl btn-hover-lift relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  🎯 Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button className="group border-2 border-gray-300 hover:border-purple-400 text-gray-700 hover:text-purple-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 btn-hover-lift">
                <Play className="mr-2 w-5 h-5 inline group-hover:scale-110 transition-transform" />
                🎬 Watch Demo
              </button>
            </div>

            {/* Enhanced trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center glass px-6 py-3 rounded-full border border-white/30 shadow-lg backdrop-blur-md">
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                <span className="text-gray-700 font-medium">✨ No setup fees</span>
              </div>
              <div className="flex items-center glass px-6 py-3 rounded-full border border-white/30 shadow-lg backdrop-blur-md">
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                <span className="text-gray-700 font-medium">💎 5% fee on free plan</span>
              </div>
              <div className="flex items-center glass px-6 py-3 rounded-full border border-white/30 shadow-lg backdrop-blur-md">
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                <span className="text-gray-700 font-medium">🔄 Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get started in 30 seconds
            </h2>
            <p className="text-xl text-gray-600">
              Copy, paste, done. It's really that simple.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Code Block */}
            <div className="order-2 lg:order-1">
              <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-700">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-300 text-sm font-mono">index.html</span>
                  <button
                    onClick={copyCode}
                    className="flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="p-6">
                  <pre className="text-green-400 text-sm overflow-x-auto font-mono">
                    <code>{`<script src="https://cdn.bidform.online/widget.js"
  data-merchant="your_id"
  data-product="vintage-watch"
  data-title="Vintage Rolex"
  data-price="2500"
  async></script>
<div id="bid-widget"></div>`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Preview */}
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
          <div className="text-center">
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
                description: "Embed bid forms anywhere with a single script tag. Auto-detects product info from your page.",
                color: "from-yellow-400 to-orange-500"
              },
              {
                icon: <CreditCard className="w-8 h-8" />,
                title: "Split Payments",
                description: "10% deposit + 90% balance workflow. Automatically handle partial payments with Stripe.",
                color: "from-blue-400 to-purple-500"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Universal Compatibility",
                description: "Works on any website - WordPress, Shopify, custom sites. No platform restrictions.",
                color: "from-green-400 to-blue-500"
              },
              {
                icon: <Layers className="w-8 h-8" />,
                title: "Auto Split Payouts",
                description: "Funds go directly to merchants via Stripe Connect. Platform takes only service fee.",
                color: "from-purple-400 to-pink-500"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure & Compliant",
                description: "Bank-level security with PCI DSS compliance. Automatic fraud protection included.",
                color: "from-red-400 to-pink-500"
              },
              {
                icon: <Code2 className="w-8 h-8" />,
                title: "Developer Friendly",
                description: "REST API, webhooks, SDKs. Full customization and white-label options available.",
                color: "from-indigo-400 to-purple-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get started in 30 seconds
            </h2>
            <p className="text-xl text-gray-600">
              Copy, paste, done. It's really that simple.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Code Block */}
            <div className="order-2 lg:order-1">
              <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-700">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-300 text-sm font-mono">index.html</span>
                  <button
                    onClick={copyCode}
                    className="flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="p-6">
                  <pre className="text-green-400 text-sm overflow-x-auto font-mono">
                    <code>{`<script src="https://cdn.bidform.online/widget.js"
  data-merchant="your_id"
  data-product="vintage-watch"
  data-title="Vintage Rolex"
  data-price="2500"
  async></script>
<div id="bid-widget"></div>`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Preview */}
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
                description: "Embed bid forms anywhere with a single script tag. Auto-detects product info from your page.",
                color: "from-yellow-400 to-orange-500"
              },
              {
                icon: <CreditCard className="w-8 h-8" />,
                title: "Split Payments",
                description: "10% deposit + 90% balance workflow. Automatically handle partial payments with Stripe.",
                color: "from-blue-400 to-purple-500"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Universal Compatibility",
                description: "Works on any website - WordPress, Shopify, custom sites. No platform restrictions.",
                color: "from-green-400 to-blue-500"
              },
              {
                icon: <Layers className="w-8 h-8" />,
                title: "Auto Split Payouts",
                description: "Funds go directly to merchants via Stripe Connect. Platform takes only service fee.",
                color: "from-purple-400 to-pink-500"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure & Compliant",
                description: "Bank-level security with PCI DSS compliance. Automatic fraud protection included.",
                color: "from-red-400 to-pink-500"
              },
              {
                icon: <Code2 className="w-8 h-8" />,
                title: "Developer Friendly",
                description: "REST API, webhooks, SDKs. Full customization and white-label options available.",
                color: "from-indigo-400 to-purple-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600">
              Simple 3-step process for both merchants and buyers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Embed & Configure",
                description: "Add one line of code to your website. Configure product details and payment settings.",
                icon: <Code2 className="w-12 h-12" />,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "02",
                title: "Receive Bids",
                description: "Buyers submit bids with 10% deposit. You get notified and can accept or decline.",
                icon: <MessageSquare className="w-12 h-12" />,
                color: "from-pink-500 to-orange-500"
              },
              {
                step: "03",
                title: "Complete Sale",
                description: "Once accepted, buyer pays remaining 90%. Funds split automatically via Stripe.",
                icon: <CheckCircle className="w-12 h-12" />,
                color: "from-orange-500 to-red-500"
              }
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-purple-200 to-pink-200 transform -translate-y-1/2 z-0"></div>
                )}
                <div className="relative z-10">
                  <div className={`w-24 h-24 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl`}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-purple-300 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm shadow-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Free",
                price: "$0",
                period: "/month",
                description: "Perfect for getting started",
                features: [
                  "Unlimited bid forms",
                  "5% service fee",
                  "Basic email support",
                  "Standard templates",
                  "CSV export"
                ],
                cta: "Start Free",
                popular: false,
                color: "from-gray-600 to-gray-700"
              },
              {
                name: "Basic",
                price: "$19.9",
                period: "/month",
                description: "For growing businesses",
                features: [
                  "Up to 5 active forms",
                  "0% service fee",
                  "Priority email support",
                  "Custom branding",
                  "Advanced analytics",
                  "Webhook support"
                ],
                cta: "Start Trial",
                popular: true,
                color: "from-purple-600 to-pink-600"
              },
              {
                name: "Pro",
                price: "$199",
                period: "/month",
                description: "For enterprises",
                features: [
                  "Up to 10,000 forms",
                  "0% service fee",
                  "Phone & chat support",
                  "White label options",
                  "API access",
                  "Multi-brand support",
                  "Custom integrations"
                ],
                cta: "Contact Sales",
                popular: false,
                color: "from-indigo-600 to-purple-600"
              }
            ].map((plan, index) => (
              <div key={index} className={`relative bg-white/80 backdrop-blur-sm rounded-3xl transition-all hover:shadow-2xl border-2 ${
                plan.popular ? 'border-purple-300 scale-105 shadow-xl' : 'border-gray-200 shadow-lg hover:border-purple-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="p-8">
                  <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="flex items-baseline mb-8">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-xl text-gray-500 ml-2">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-4 px-6 rounded-2xl font-bold transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                      : 'border-2 border-gray-200 hover:border-purple-300 text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}>
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to start accepting bids?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of merchants who trust BidForm for their high-value transactions. 
            Get started in less than 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowLoginModal(true)}
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 inline" />
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-bold">BidForm</span>
              </div>
              <p className="text-gray-400 mb-6">
                Accept bids on any website with one line of code.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
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
}

export default App;