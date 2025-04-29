
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('calroute_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = () => {
    // Simulate login
    const mockUser = {
      id: '1',
      name: 'Max Johnson',
      email: 'max@example.com',
    };
    
    setUser(mockUser);
    localStorage.setItem('calroute_user', JSON.stringify(mockUser));
    
    // Check if user has completed preferences
    const hasPreferences = localStorage.getItem('calroute_preferences');
    
    if (hasPreferences) {
      navigate('/homepage');
    } else {
      navigate('/preferences');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('calroute_user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
