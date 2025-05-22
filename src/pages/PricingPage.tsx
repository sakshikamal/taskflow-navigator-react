import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed w-full p-4 flex justify-between items-center backdrop-blur-sm bg-white/80 border-b border-gray-200 z-50">
        <Link to="/" className="flex items-center">
          <img src="/uploads/logo.png" alt="CalRoute Logo" className="w-12 h-12 rounded-md" />
          <span className="text-2xl font-bold text-calroute-blue">CalRoute</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-calroute-blue transition-colors duration-300">
            Home
          </Link>
          <Link to="/login">
            <Button variant="outline" className="text-calroute-blue border-calroute-blue/30 hover:bg-calroute-blue/10">
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-16 px-6 bg-gradient-to-b from-[rgb(93,224,230)]/10 to-white">
        <div className="max-w-6xl mx-auto">
          {/* Pricing Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[rgb(93,224,230)] to-[rgb(0,74,173)] bg-clip-text text-transparent leading-relaxed pb-2">Pricing Plans</h1>
            <p className="text-xl text-calroute-blue">Choose the plan that works best for you</p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Freemium Plan */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Freemium</h2>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#38bdf8]">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Scheduling with Ads</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Smart Task Sequencing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Dynamic Re-routing</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-gray-400">AI Assisted Planning</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-gray-400">Limited Re-optimizing</span>
                </div>
              </div>
              <Button className="w-full bg-calroute-blue hover:bg-calroute-blue/90">Get Started</Button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-calroute-blue transform scale-105">
              <div className="absolute top-0 right-0 bg-calroute-blue text-white px-4 py-1 rounded-bl-lg rounded-tr-2xl text-sm">
                Popular
              </div>
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Premium</h2>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#38bdf8]">$8</span>
                <span className="text-gray-600">/month</span>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Exclusive Scheduling without Ads</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Smart Task Sequencing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Dynamic Re-routing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>AI Assisted Planning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Unlimited Re-optimizing</span>
                </div>
              </div>
              <Button className="w-full bg-calroute-blue hover:bg-calroute-blue/90">Subscribe Now</Button>
            </div>

            {/* Business Plan */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Premium Plan for Businesses</h2>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#38bdf8]">Custom</span>
                <span className="text-gray-600"> Pricing</span>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Dynamic Re-routing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>AI Assisted Planning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Unlimited Re-optimizing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Instant Push Notifications</span>
                </div>
              </div>
              <Button className="w-full bg-calroute-blue hover:bg-calroute-blue/90">Contact Sales</Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center bg-gray-50 border-t border-gray-200">
        <div className="text-gray-600">
          © {new Date().getFullYear()} CalRoute. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 