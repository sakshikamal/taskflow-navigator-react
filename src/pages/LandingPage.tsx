
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(90deg,rgb(93,224,230),rgb(0,74,173))] text-white">
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/uploads/logo.jpeg" alt="CalRoute Logo" className="w-10 h-10 mr-3 rounded-md" />
          <span className="text-2xl font-bold">CalRoute</span>
        </div>
        <Link to="/login">
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-calroute-blue">
            Login
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-5xl font-bold mb-6">
          Schedule now with CalRoute
        </h1>
        <p className="text-xl mb-8 max-w-2xl">
          From Chaos to Clarity, one route at a time. Effortlessly plan your multi-stop days, optimize your journeys, and reclaim your time.
        </p>
        {/* Placeholder for future animated text and feature boxes */}
        {/* 
          <div className="my-8">
            <p className="text-lg italic">"Multi-stop scheduling..."</p>
            <p className="text-lg italic">"One stop scheduling..."</p>
          </div>
          <div className="my-8 p-4 border border-white/50 rounded-lg max-w-3xl">
             <h2 className="text-2xl font-semibold mb-4">Features Roadmap</h2>
             <p>(Feature boxes will go here)</p>
          </div>
        */}
        <Link to="/login">
          <Button size="lg" className="bg-white text-calroute-blue hover:bg-gray-200 px-10 py-6 text-lg">
            Get Started
          </Button>
        </Link>
      </main>

      <footer className="p-6 text-center text-sm">
        © {new Date().getFullYear()} CalRoute. All rights reserved.
      </footer>
    </div>
  );
}
