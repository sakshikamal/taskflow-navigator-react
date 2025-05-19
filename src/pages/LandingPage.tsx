import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TypewriterText } from '@/components/TypewriterText';

export default function LandingPage() {
  const sentences = [
    "From Chaos to Clarity, one route at a time.",
    "Effortlessly plan your multi-stop days.",
    "Optimize your journeys, and reclaim your time."
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(90deg,rgb(93,224,230),rgb(0,74,173))] text-white">
      {/* Header */}
      <header className="p-6 flex justify-between items-center backdrop-blur-sm bg-white/5 border-b border-white/10">
        <div className="flex items-center">
          <img src="/uploads/logo.png" alt="CalRoute Logo" className="w-16 h-16 rounded-md" />
          <span className="text-2xl font-bold">CalRoute</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/features" className="text-white/80 hover:text-white transition-colors duration-300">
            Features
          </Link>
          <Link to="/pricing" className="text-white/80 hover:text-white transition-colors duration-300">
            Pricing
          </Link>
          <Link to="/login">
            <Button variant="outline" className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300">
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90 leading-tight">
            Schedule now with CalRoute
          </h1>
          
          <div className="text-2xl mb-12 h-8 font-light max-w-3xl mx-auto">
            <TypewriterText 
              sentences={sentences}
              typingDelay={50}
              deletingDelay={30}
              pauseDelay={1500}
              className="block"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Link to="/login">
              <Button size="lg" className="bg-white text-calroute-blue hover:bg-white/90 px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started
              </Button>
            </Link>
            <Link to="/contact" className="text-white/80 hover:text-white transition-colors duration-300 text-lg">
              Contact us →
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Smart Routing */}
            <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-white/10 border border-white/20 shadow-lg backdrop-blur-sm text-center min-h-[340px]">
              <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-white/10 mb-6">
                {/* Map Icon */}
                <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Routing</h3>
              <p className="text-lg text-white/80 font-normal">Optimize your journey with AI-powered route planning and real-time traffic updates</p>
            </div>
            {/* Time Management */}
            <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-white/10 border border-white/20 shadow-lg backdrop-blur-sm text-center min-h-[340px]">
              <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-white/10 mb-6">
                {/* Clock Icon */}
                <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Time Management</h3>
              <p className="text-lg text-white/80 font-normal">Efficiently manage your schedule and tasks with smart prioritization and reminders</p>
            </div>
            {/* Real-time Updates */}
            <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-white/10 border border-white/20 shadow-lg backdrop-blur-sm text-center min-h-[340px]">
              <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-white/10 mb-6">
                {/* Lightning Icon */}
                <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Real-time Updates</h3>
              <p className="text-lg text-white/80 font-normal">Stay informed with live traffic and schedule updates to make better decisions</p>
            </div>
          </div>

          {/* Integration Section */}
          <div className="mt-32 text-center">
            <h2 className="text-3xl font-bold mb-12">Integrate with your favorite tools</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {['Google Calendar', 'Todoist', 'Apple Maps', 'Waze'].map((tool) => (
                <div key={tool} className="p-6 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <span className="text-white/80">{tool}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center backdrop-blur-sm bg-white/5 border-t border-white/10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-white/60">
              <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-white/60">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-white/60">
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="/api" className="hover:text-white transition-colors">API</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-white/60">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-white/60">
          © {new Date().getFullYear()} CalRoute. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
