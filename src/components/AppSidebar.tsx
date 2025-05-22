import { useState } from 'react';
import { Home, Calendar as CalendarIcon, ListTodo, Menu, X, LogOut, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  const navItems = [
    { path: '/homepage', icon: <Home size={20} />, label: 'Home' },
    { path: '/calendar', icon: <CalendarIcon size={20} />, label: 'Calendar' },
    { path: '/todoist', icon: <ListTodo size={20} />, label: 'Tasks' },
    { path: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div 
      className={cn(
        "fixed bg-gradient-to-b from-[rgb(0,74,173)] to-[rgb(93,224,230)] text-white transition-all duration-300 flex flex-col z-20",
        // Mobile: Bottom navigation
        "md:top-0 md:left-0 md:h-full", // Desktop: Side navigation
        "bottom-0 left-0 right-0 h-16 md:h-full", // Mobile: Bottom bar
        expanded ? "md:w-64" : "md:w-16", // Width only applies to desktop
      )}
    >
      {/* Logo and Toggle - Only visible on desktop */}
      <div className="hidden md:flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center min-w-0">
          <img 
            src="/uploads/logo.png" 
            alt="CalRoute Logo" 
            className={cn(
              "rounded-xl transition-all duration-300",
              expanded ? "w-12 h-12" : "w-10 h-10"
            )}
          />
          {expanded && (
            <span className="font-bold text-lg tracking-wide ml-2">
              CalRoute
            </span>
          )}
        </div>
        <button 
          onClick={toggleSidebar}
          className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors"
        >
          {expanded ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Welcome message and User Profile - Only visible on desktop when expanded */}
      <div className="hidden md:block flex-1 py-6">
        {user && expanded && (
          <div className="mb-6 px-4 py-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <User size={24} className="text-white/80" />
              </div>
              <div>
                <p className="text-sm text-white/70">Welcome back,</p>
                <p className="font-semibold text-white/90 truncate">{user.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:block space-y-2 px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-3 rounded-xl transition-all duration-200",
                location.pathname === item.path 
                  ? "bg-white/20 font-semibold shadow-inner" 
                  : "hover:bg-white/10",
                !expanded && "justify-center"
              )}
              title={item.label}
            >
              {item.icon}
              {expanded && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex justify-around items-center h-full">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-200",
              location.pathname === item.path 
                ? "bg-white/20 font-semibold" 
                : "hover:bg-white/10"
            )}
            title={item.label}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      {/* Logout button - Only visible on desktop */}
      <div className="hidden md:block p-3 border-t border-white/10 bg-white/5">
        <button 
          onClick={handleLogout}
          className={cn(
            "flex items-center text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 px-3 py-3 w-full",
            !expanded && "justify-center"
          )}
          title="Logout"
        >
          <LogOut size={20} />
          {expanded && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
}
