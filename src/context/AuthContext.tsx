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
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("calroute_user");
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
  };

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
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};