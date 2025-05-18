
import { useState } from 'react';
import { Home, User, Calendar as CalendarIcon, ListTodo, Menu, X, LogOut } from 'lucide-react'; // Added LogOut icon
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth(); // Added logout from useAuth
  const navigate = useNavigate(); // For redirecting after logout
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  const navItems = [
    { path: '/homepage', icon: <Home size={20} />, label: 'Home' }, // Adjusted icon size
    { path: '/profile', icon: <User size={20} />, label: 'Profile' },
    { path: '/calendar', icon: <CalendarIcon size={20} />, label: 'Calendar' },
    { path: '/todoist', icon: <ListTodo size={20} />, label: 'Todoist' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 h-full bg-calroute-blue text-white transition-all duration-300 flex flex-col z-20 shadow-lg", // Added z-index and shadow
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/20"> {/* Added border */}
        <div className="flex items-center min-w-0"> {/* Added min-w-0 for truncation */}
          <img 
            src="/uploads/logo.jpeg" 
            alt="CalRoute Logo" 
            className="w-8 h-8 mr-2 rounded-md flex-shrink-0" 
          />
          {expanded && <span className="font-bold truncate">CalRoute</span>} {/* Added truncate */}
        </div>
        <button 
          onClick={toggleSidebar}
          className="text-white hover:bg-white/20 rounded-md p-1"
        >
          {expanded ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto"> {/* Added overflow-y-auto */}
        {user && expanded && (
          <div className="mb-6 px-4 py-2">
            <p className="text-sm text-gray-200">Hello,</p>
            <p className="font-semibold truncate">{user.name}</p>
          </div>
        )}
          
        <nav className="space-y-1 px-2"> {/* Adjusted padding */}
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-md transition-colors text-sm", // Adjusted padding and text size
                location.pathname === item.path 
                  ? "bg-calroute-green font-semibold" 
                  : "hover:bg-white/20"
              )}
              title={item.label} // Add title for tooltip on collapsed state
            >
              {item.icon}
              {expanded && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Footer section with Settings and Logout */}
      <div className="p-2 border-t border-white/20"> {/* Adjusted padding and added border */}
        {user && (
          <button 
            onClick={() => navigate('/profile')} // Navigate to profile for settings
            className={cn(
              "flex items-center text-white hover:bg-white/20 rounded-md transition-colors px-3 py-2.5 w-full text-sm mb-1", // Adjusted padding and text size
            )}
            title="Settings"
          >
            <User size={20} /> {/* Using User icon for settings for now */}
            {expanded && <span className="ml-3">Settings</span>}
          </button>
        )}
        <button 
          onClick={handleLogout}
          className={cn(
            "flex items-center text-white hover:bg-red-500/80 rounded-md transition-colors px-3 py-2.5 w-full text-sm", // Adjusted padding and text size
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
