import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage'; // New Landing Page
import Login from './pages/Login';
import Preferences from './pages/Preferences';
import Homepage from './pages/Homepage';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar';
import TodoList from './pages/TodoList';
import NotFound from "./pages/NotFound";
import PricingPage from './pages/PricingPage'; // Add PricingPage import
// Index page is no longer needed as LandingPage takes over the root route.

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pricing" element={<PricingPage />} /> {/* Add Pricing Route */}
            
            {/* Protected Routes */}
            <Route path="/preferences" element={
              <ProtectedRoute>
                <Preferences />
              </ProtectedRoute>
            } />
            <Route path="/homepage" element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            } />
            <Route path="/todoist" element={
              <ProtectedRoute>
                <TodoList />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
