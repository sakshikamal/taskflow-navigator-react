import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TypewriterText } from '@/components/TypewriterText';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setIsScrolled(heroBottom <= 80); // 80px is header height
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sentences = [
    "From Chaos to Clarity, one route at a time.",
    "Effortlessly plan your multi-stop days.",
    "Optimize your journeys, and reclaim your time."
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Gradient */}
      <div id="hero" className="bg-[linear-gradient(90deg,rgb(93,224,230),rgb(0,74,173))]">
        {/* Header */}
        <header className={`fixed w-full p-4 flex justify-between items-center backdrop-blur-sm ${isScrolled ? 'bg-white/80' : 'bg-white/5'} border-b ${isScrolled ? 'border-gray-200' : 'border-white/10'} z-50 transition-all duration-300`}>
          <div className="flex items-center">
            <img src="/uploads/logo.png" alt="CalRoute Logo" className="w-12 h-12 rounded-md" />
            <span className={`text-2xl font-bold ${isScrolled ? 'text-calroute-blue' : 'text-white'}`}>CalRoute</span>
          </div>

          {/* Hamburger Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <svg 
              className={`w-6 h-6 ${isScrolled ? 'text-gray-600' : 'text-white'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => scrollToSection('about')} 
              className={`${isScrolled ? 'text-gray-600 hover:text-calroute-blue' : 'text-white/80 hover:text-white'} transition-colors duration-300`}
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className={`${isScrolled ? 'text-gray-600 hover:text-calroute-blue' : 'text-white/80 hover:text-white'} transition-colors duration-300`}
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('team')} 
              className={`${isScrolled ? 'text-gray-600 hover:text-calroute-blue' : 'text-white/80 hover:text-white'} transition-colors duration-300`}
            >
              Team
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className={`${isScrolled ? 'text-gray-600 hover:text-calroute-blue' : 'text-white/80 hover:text-white'} transition-colors duration-300`}
            >
              Contact
            </button>
            <Link 
              to="/pricing" 
              className={`${isScrolled ? 'text-gray-600 hover:text-calroute-blue' : 'text-white/80 hover:text-white'} transition-colors duration-300`}
            >
              Pricing
            </Link>
            <Link to="/login">
              <Button 
                variant={isScrolled ? "outline" : "default"}
                className={`${
                  isScrolled 
                    ? 'text-calroute-blue border-calroute-blue/30 hover:bg-calroute-blue/10' 
                    : 'bg-white text-[rgb(0,74,173)] hover:bg-white/90'
                } transition-all duration-300`}
              >
                Login
              </Button>
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Menu */}
        <div className={`
          fixed top-[72px] right-0 w-64 bg-white shadow-lg rounded-bl-xl transform transition-transform duration-300 ease-in-out z-40
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          md:hidden
        `}>
          <div className="flex flex-col py-4">
            <button 
              onClick={() => scrollToSection('about')}
              className="px-6 py-3 text-gray-600 hover:text-calroute-blue text-left"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="px-6 py-3 text-gray-600 hover:text-calroute-blue text-left"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('team')}
              className="px-6 py-3 text-gray-600 hover:text-calroute-blue text-left"
            >
              Team
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-6 py-3 text-gray-600 hover:text-calroute-blue text-left"
            >
              Contact
            </button>
            <Link 
              to="/pricing" 
              className="px-6 py-3 text-gray-600 hover:text-calroute-blue text-left"
            >
              Pricing
            </Link>
            <Link to="/login" className="px-6 py-3">
              <Button variant="outline" className="w-full text-calroute-blue border-calroute-blue/30 hover:bg-calroute-blue/10">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Content */}
        <div className="pt-56 pb-40 px-6 text-center text-white">
          <h1 className="mt-12 text-6xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90 leading-tight">
            Schedule now with CalRoute
          </h1>
          
          <div className="text-2xl mb-16 h-8 font-light max-w-3xl mx-auto">
            <TypewriterText 
              sentences={sentences}
              typingDelay={50}
              deletingDelay={30}
              pauseDelay={1500}
              className="block"
            />
          </div>

          <div className="flex flex-col items-center gap-8 mb-16">
            <Link to="/login">
              <Button size="lg" className="bg-white text-[rgb(0,74,173)] hover:bg-white/90 px-12 py-6 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started
              </Button>
            </Link>
            <p className="text-lg text-white/90">
              Download for iOS and Android today
            </p>
          </div>
        </div>
      </div>

      {/* Gradient Transition */}
      <div className="h-52 bg-gradient-to-b from-white via-[rgb(240,248,255)] to-white"></div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-white -mt-32">
        {/* About Section */}
        <section id="about" className="w-full px-6 py-24">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">About CalRoute</h2>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Main Vision */}
              <div className="p-8 bg-white border-b border-gray-100">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 flex-shrink-0 bg-calroute-blue/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-calroute-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    CalRoute bridges the gap between calendars, task managers, and navigation apps unifying them into one intelligent, location-aware daily planner.
                  </p>
                </div>
              </div>

              {/* Unique Features */}
              <div className="p-8 bg-gradient-to-r from-[rgb(93,224,230)]/5 to-[rgb(0,74,173)]/5 border-b border-gray-100">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 flex-shrink-0 bg-calroute-blue/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-calroute-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Unlike traditional tools, CalRoute doesn't just tell you what to do — it tells you when, where, how and in what order to do it. By factoring in live traffic, task urgency, location proximity, and personal routines, it organizes your day into a logical, stress-free flow.
                  </p>
                </div>
              </div>

              {/* Dynamic Adaptation */}
              <div className="p-8 bg-white border-b border-gray-100">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 flex-shrink-0 bg-calroute-blue/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-calroute-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Designed for busy individuals who value efficiency and clarity, CalRoute dynamically adjusts to real-world changes — delays, cancellations, or new tasks — and continually learns your preferences over time.
                  </p>
                </div>
              </div>

              {/* Target Users */}
              <div className="p-8 bg-gradient-to-r from-[rgb(93,224,230)]/5 to-[rgb(0,74,173)]/5">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 flex-shrink-0 bg-calroute-blue/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-calroute-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Whether you're a professional managing meetings, a student juggling deadlines, or a traveler planning your day on the move, CalRoute helps you make smarter decisions, save time, and stay focused — automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-16 text-center text-gray-900">Product Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-8">
              <div className="bg-gray-50 p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-calroute-blue/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-calroute-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Smart Routing</h3>
                <p className="text-gray-600">AI-powered route optimization for efficient multi-stop journeys</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-calroute-blue/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-calroute-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Time Management</h3>
                <p className="text-gray-600">Schedule optimization with real-time traffic updates</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-calroute-blue/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-calroute-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Real-time Updates</h3>
                <p className="text-gray-600">Live traffic and schedule synchronization</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-calroute-blue/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-calroute-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 9a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0V9z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.07-6.07l-1.42 1.42M6.34 17.66l-1.42 1.42m12.02 0l-1.42-1.42M6.34 6.34L4.92 4.92" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">AI-Powered Task Understanding</h3>
                <p className="text-gray-600">CalRoute uses AI to understand your tasks, even if you type them in your own words.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-calroute-blue/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-calroute-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Learns Your Routines</h3>
                <p className="text-gray-600">The app gets smarter over time by learning your habits and preferences.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-calroute-blue/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-calroute-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="7" cy="7" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="17" cy="7" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="17" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Groups Nearby Tasks</h3>
                <p className="text-gray-600">CalRoute puts together tasks that are close to each other, so you spend less time traveling.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="w-full px-6 py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-16 text-center text-gray-900">How it Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-calroute-blue/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-calroute-blue">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Install CalRoute</h3>
                <p className="text-gray-600">Download the app and create your account</p>
              </div>
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-calroute-blue/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-calroute-blue">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Add Your Stops</h3>
                <p className="text-gray-600">Input your destinations and preferences</p>
              </div>
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-calroute-blue/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-calroute-blue">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Get Optimized Routes</h3>
                <p className="text-gray-600">Let AI plan your perfect route</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full px-6 py-24 bg-gradient-to-r from-[rgb(93,224,230)]/20 to-[rgb(0,74,173)]/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-16 text-center text-gray-900">What People Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg">
                <p className="mb-4 italic text-gray-700">"CalRoute has transformed how I manage my daily routes. The AI optimization is incredible!"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-calroute-blue/10 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold text-gray-900">John Doe</h4>
                    <p className="text-sm text-gray-600">Delivery Service Manager</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
                <p className="mb-4 italic text-gray-700">"The real-time updates have saved me countless hours of replanning routes."</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-calroute-blue/10 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Jane Smith</h4>
                    <p className="text-sm text-gray-600">Field Service Technician</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About/Team Section */}
        <section id="team" className="w-full px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-16 text-center text-gray-900">Meet Our Team</h2>
            
            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
              <div className="text-center bg-calroute-blue/20 p-6 rounded-xl">
                <div className="w-32 h-32 bg-calroute-blue/30 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center">
                  <img src="/sakshi.jpeg" alt="Sakshi Kamal" className="w-full h-full object-cover rounded-full" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Sakshi Kamal</h3>
                <p className="text-gray-600">Team Lead & Developer</p>
              </div>
              <div className="text-center bg-calroute-blue/10 p-6 rounded-xl">
                <div className="w-32 h-32 bg-calroute-blue/20 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center">
                  <img src="/avaneesh.JPG" alt="Avaneesh Anand Lal" className="w-full h-full object-cover rounded-full" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Avinash Anand Lal</h3>
                <p className="text-gray-600">Developer</p>
              </div>
              <div className="text-center bg-calroute-blue/10 p-6 rounded-xl">
                <div className="w-32 h-32 bg-calroute-blue/20 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center">
                  <img src="/revathi.jpeg" alt="Revathi Bhat A" className="w-full h-full object-cover rounded-full" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Revathi Bhat A</h3>
                <p className="text-gray-600">Developer</p>
              </div>
              <div className="text-center bg-calroute-blue/20 p-6 rounded-xl">
                <div className="w-32 h-32 bg-calroute-blue/30 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center">
                  <img src="/abhisek.jpeg" alt="Abhishek Hallad" className="w-full h-full object-cover rounded-full" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Abhishek Hallad</h3>
                <p className="text-gray-600">Developer</p>
              </div>
            </div>

            {/* Video Section */}
            <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">Elevator Pitch</h3>
            <div className="max-w-4xl mx-auto">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  className="w-full h-[400px] rounded-xl shadow-lg"
                  src="https://www.youtube.com/embed/2dbzeZZG3Oo"
                  title="CalRoute Elevator Pitch"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full px-6 py-24 bg-gradient-to-r from-[rgb(93,224,230)]/20 to-[rgb(0,74,173)]/20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-16 text-gray-900">Get in Touch</h2>
            <div className="space-y-4 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg">
              <p className="text-xl text-gray-700">Sakshi Kamal</p>
              <p className="text-xl">
                <a href="mailto:sakshk2@uci.edu" className="text-calroute-blue hover:text-calroute-blue/80 transition-colors">
                  sakshk2@uci.edu
                </a>
              </p>
            </div>
          </div>
        </section>
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