import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import { LoginModal } from './components/Auth/LoginModal';
import { Dashboard } from './components/Dashboard/Dashboard';
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
  TrendingUp,
  ShoppingCart,
  Palette,
  Clock,
  Award,
  Coins,
  Package
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
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Helmet>
          <title>BidForm – Embedded Bid Forms with Stripe Split Payments for Any Website</title>
          <meta name="description" content="Add an embedded bid form to your website in minutes. Let customers submit offers, pay deposits, and complete payments with automatic Stripe split payments. No payment license required." />
          <meta name="keywords" content="bid form, embedded payments, stripe split payments, auction widget, offer forms, e-commerce bidding" />
          <meta property="og:title" content="BidForm – Embedded Bid Forms with Stripe Split Payments" />
          <meta property="og:description" content="Turn every offer into a sale with embedded bid forms. No coding required, automatic split payments." />
          <meta property="og:type" content="website" />
          <link rel="canonical" href="https://bidform.online" />
        </Helmet>
        
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
            element={user ? <Dashboard /> : <Navigate to="/" replace />} 
          />
        </Routes>
        
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      </div>
    </Router>
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
      {/* Enhanced Navigation */}
      <nav className="fixed w-full glass border-b border-white/20 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex items-center group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <span className="ml-3 text-2xl font-black gradient-text">
                  BidForm
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition-all font-semibold hover:scale-105 px-3 py-2 rounded-lg hover:bg-purple-50">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 transition-all font-semibold hover:scale-105 px-3 py-2 rounded-lg hover:bg-purple-50">How It Works</a>
              <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-all font-semibold hover:scale-105 px-3 py-2 rounded-lg hover:bg-purple-50">Pricing</a>
              <a href="#faq" className="text-gray-700 hover:text-purple-600 transition-all font-semibold hover:scale-105 px-3 py-2 rounded-lg hover:bg-purple-50">FAQ</a>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="text-gray-700 hover:text-purple-600 transition-all font-semibold hover:scale-105 px-3 py-2 rounded-lg hover:bg-purple-50"
              >
                Sign In
              </button>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl btn-hover-lift"
              >
                Start for Free – Launch in 5 Minutes
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

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden glass border-t border-white/20 shadow-xl">
            <div className="px-6 py-6 space-y-4">
              <a href="#features" className="block text-gray-700 hover:text-purple-600 font-semibold py-3 px-4 rounded-xl hover:bg-purple-50 transition-all">Features</a>
              <a href="#how-it-works" className="block text-gray-700 hover:text-purple-600 font-semibold py-3 px-4 rounded-xl hover:bg-purple-50 transition-all">How It Works</a>
              <a href="#pricing" className="block text-gray-700 hover:text-purple-600 font-semibold py-3 px-4 rounded-xl hover:bg-purple-50 transition-all">Pricing</a>
              <a href="#faq" className="block text-gray-700 hover:text-purple-600 font-semibold py-3 px-4 rounded-xl hover:bg-purple-50 transition-all">FAQ</a>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="block w-full text-left text-gray-700 hover:text-purple-600 font-semibold py-3 px-4 rounded-xl hover:bg-purple-50 transition-all"
              >
                Sign In
              </button>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg"
              >
                Generate Your Bid Form Now
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with H1 */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-100/80 to-blue-100/80 backdrop-blur-sm rounded-full text-emerald-700 text-sm font-semibold mb-8 border border-emerald-200/50 shadow-lg">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              No coding. No license. No waiting.
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Turn Every Offer Into a Sale with
              <span className="block gradient-text animate-pulse-slow">
                Embedded Bid Forms
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              Add an embedded bid form to your website in minutes. Let customers submit offers, pay deposits, 
              and complete payments with automatic Stripe split payments. <strong>No payment license required.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button 
                onClick={() => setShowLoginModal(true)}
                className="group bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl btn-hover-lift relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Start for Free – Launch in 5 Minutes
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button className="group border-2 border-gray-300 hover:border-purple-400 text-gray-700 hover:text-purple-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 btn-hover-lift">
                <Play className="mr-2 w-5 h-5 inline group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center glass px-6 py-3 rounded-full border border-white/30 shadow-lg backdrop-blur-md">
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                <span className="text-gray-700 font-medium">Only 5% service fee on free plan</span>
              </div>
              <div className="flex items-center glass px-6 py-3 rounded-full border border-white/30 shadow-lg backdrop-blur-md">
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                <span className="text-gray-700 font-medium">Upgrade to remove fees</span>
              </div>
              <div className="flex items-center glass px-6 py-3 rounded-full border border-white/30 shadow-lg backdrop-blur-md">
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                <span className="text-gray-700 font-medium">Works with Stripe Connect</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Benefits Section - H2 */}
      <section className="py-20 bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-sm relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Core Benefits That Drive Sales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to turn browsers into buyers with embedded bid forms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Code2 className="w-8 h-8" />,
                title: "No Coding Required",
                description: "Embed in any website with a single line of code.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Automatic Split Payments",
                description: "Get paid instantly via Stripe Connect.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Seller Control",
                description: "Choose winning offers based on your own criteria.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Works Anywhere",
                description: "Shopify, WooCommerce, Wix, Squarespace, or custom sites.",
                color: "from-orange-500 to-red-500"
              }
            ].map((benefit, index) => (
              <div key={index} className="group">
                <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 h-full text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>