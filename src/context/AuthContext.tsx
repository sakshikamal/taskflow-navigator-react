// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  todoist_token?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: () => void;
  logout: () => void;
  setUser: (u: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1) Try restoring from localStorage (optional)
    const stored = localStorage.getItem('calroute_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }

    // 2) Fetch the session-based user from Flask
    fetch(`${API_BASE}/me`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('No session');
        return res.json();
      })
      .then((me: User) => {
        setUser(me);
        localStorage.setItem('calroute_user', JSON.stringify(me));
        // After login, check for preferences and redirect accordingly
        const hasPreferences = localStorage.getItem('calroute_preferences');
        if (window.location.pathname === '/login' || window.location.pathname === '/') {
          if (hasPreferences) {
            navigate('/homepage', { replace: true });
          } else {
            navigate('/preferences', { replace: true });
          }
        }
      })
      .catch(() => {
        // no session or error, leave user = null
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = () => {
    // full-page redirect to Flask Google OAuth endpoint
    window.location.href = `${API_BASE}/login/google`;
  };

  const logout = () => {
    // optional: hit server-side logout
    fetch(`${API_BASE}/logout`, {
      method: 'POST',
      credentials: 'include'
    }).finally(() => {
      setUser(null);
      localStorage.removeItem('calroute_user');
      navigate('/login');
    });
  //   console.log('AuthProvider: Initializing...');
  //   // Check if user is logged in
  //   const storedUser = localStorage.getItem('calroute_user');
  //   console.log('AuthProvider: Stored user:', storedUser);
    
  //   if (storedUser) {
  //     try {
  //       const parsedUser = JSON.parse(storedUser);
  //       console.log('AuthProvider: Setting user:', parsedUser);
  //       setUser(parsedUser);
  //     } catch (error) {
  //       console.error('AuthProvider: Error parsing stored user:', error);
  //       localStorage.removeItem('calroute_user');
  //     }
  //   }
    
  //   console.log('AuthProvider: Setting loading to false');
  //   setLoading(false);
  // }, []);

  // const login = () => {
  //   console.log('AuthProvider: Login called');
  //   // Simulate login
  //   const mockUser = {
  //     id: '1',
  //     name: 'Max Johnson',
  //     email: 'max@example.com',
  //   };
    
  //   console.log('AuthProvider: Setting user after login:', mockUser);
  //   setUser(mockUser);
  //   localStorage.setItem('calroute_user', JSON.stringify(mockUser));
    
  //   // Check if user has completed preferences
  //   const hasPreferences = localStorage.getItem('calroute_preferences');
  //   console.log('AuthProvider: Has preferences:', hasPreferences);
    
  //   if (hasPreferences) {
  //     console.log('AuthProvider: Navigating to homepage');
  //     navigate('/homepage');
  //   } else {
  //     console.log('AuthProvider: Navigating to preferences');
  //     navigate('/preferences');
  //   }
  // };

  // const logout = () => {
  //   console.log('AuthProvider: Logout called');
  //   setUser(null);
  //   localStorage.removeItem('calroute_user');
  //   navigate('/login');
  };

  const isAuthenticated = !!user;
  console.log('AuthProvider: Current state -', { user, isAuthenticated, loading });

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        setUser
      }}
    >
    {/* <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}> */}
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
