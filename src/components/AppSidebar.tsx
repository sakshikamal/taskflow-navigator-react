
import { useState } from 'react';
import { Home, User, Calendar, ListTodo, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  const navItems = [
    { path: '/homepage', icon: <Home size={24} />, label: 'Home' },
    { path: '/profile', icon: <User size={24} />, label: 'Profile' },
    { path: '/calendar', icon: <Calendar size={24} />, label: 'Calendar' },
    { path: '/todoist', icon: <ListTodo size={24} />, label: 'Todoist' },
  ];

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 h-full bg-calroute-blue transition-all duration-300 flex flex-col z-10",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <img 
            src="/uploads/logo.jpeg" 
            alt="CalRoute Logo" 
            className="w-8 h-8 mr-2" 
          />
          {expanded && <span className="text-white font-bold">CalRoute</span>}
        </div>
        <button 
          onClick={toggleSidebar}
          className="text-white hover:bg-calroute-lightBlue hover:text-calroute-blue rounded-md p-1"
        >
          {expanded ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex-1">
        <div className="px-2 py-4">
          {user && expanded && (
            <div className="mb-6 px-3 py-2 text-white">
              <p className="text-sm">Hello,</p>
              <p className="font-semibold">{user.name}</p>
            </div>
          )}
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors",
                  location.pathname === item.path 
                    ? "bg-calroute-green text-white" 
                    : "text-white hover:bg-calroute-lightBlue hover:text-calroute-blue"
                )}
              >
                <div className="flex items-center">
                  {item.icon}
                  {expanded && <span className="ml-3">{item.label}</span>}
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      {user && (
        <div className="p-4">
          <button 
            onClick={() => {}} 
            className={cn(
              "flex items-center text-white hover:bg-calroute-lightBlue hover:text-calroute-blue rounded-md transition-colors px-3 py-2 w-full",
            )}
          >
            <User size={24} />
            {expanded && <span className="ml-3">Settings</span>}
          </button>
        </div>
      )}
    </div>
  );
}
