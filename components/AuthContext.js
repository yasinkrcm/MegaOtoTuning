'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  loading: false,
  authenticatedFetch: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();



  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && user.isBanned) {
      setUser(null);
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login?error=banned';
      }
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.error && data.error.toLowerCase().includes('askıya alınmıştır')) {
          setUser(null);
          localStorage.removeItem('user');
          throw new Error(data.error);
        }
        throw new Error(data.error || 'Giriş yapılamadı');
      }

      const data = await res.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      // Use window.location.href as fallback
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  // Authenticated fetch function that includes Authorization header
  const authenticatedFetch = async (url, options = {}) => {
    if (!user) {
      throw new Error('Kullanıcı girişi gerekli');
    }

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add Authorization header with user data
    if (user) {
      headers.Authorization = `Bearer ${encodeURIComponent(JSON.stringify(user))}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.error && errorData.error.toLowerCase().includes('askıya alınmıştır')) {
        setUser(null);
        localStorage.removeItem('user');
        // Use window.location.href as fallback
        if (typeof window !== 'undefined') {
          window.location.href = '/login?error=banned';
        }
        throw new Error(errorData.error);
      }
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response;
  };

  const value = {
    user: user || null,
    login: login || (() => {}),
    logout: logout || (() => {}),
    loading: loading || false,
    authenticatedFetch: authenticatedFetch || (() => {}),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
