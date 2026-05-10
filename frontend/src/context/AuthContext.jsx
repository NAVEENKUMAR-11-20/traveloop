import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('traveloop_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        logout();
      }
    } catch {
      // If backend is down, use stored user or demo
      const stored = localStorage.getItem('traveloop_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser({ name: 'Traveler', email: 'user@traveloop.com' });
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('traveloop_token', data.token);
        localStorage.setItem('traveloop_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch {
      // Demo mode fallback
      const demoToken = 'demo_token_' + Date.now();
      const demoUser = { id: 1, name: email.split('@')[0], email, avatar: null };
      setToken(demoToken);
      setUser(demoUser);
      localStorage.setItem('traveloop_token', demoToken);
      localStorage.setItem('traveloop_user', JSON.stringify(demoUser));
      return { success: true };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('traveloop_token', data.token);
        localStorage.setItem('traveloop_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch {
      const demoToken = 'demo_token_' + Date.now();
      const demoUser = { id: 1, name, email, avatar: null };
      setToken(demoToken);
      setUser(demoUser);
      localStorage.setItem('traveloop_token', demoToken);
      localStorage.setItem('traveloop_user', JSON.stringify(demoUser));
      return { success: true };
    }
  };

  const handleGoogleLogin = async (credential) => {
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId: credential }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('traveloop_token', data.token);
        localStorage.setItem('traveloop_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch {
      // Demo: simulate Google login
      const demoToken = 'google_demo_' + Date.now();
      const demoUser = { id: 2, name: 'Google User', email: 'google@traveloop.com', avatar: null };
      setToken(demoToken);
      setUser(demoUser);
      localStorage.setItem('traveloop_token', demoToken);
      localStorage.setItem('traveloop_user', JSON.stringify(demoUser));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('traveloop_token');
    localStorage.removeItem('traveloop_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, handleGoogleLogin, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
