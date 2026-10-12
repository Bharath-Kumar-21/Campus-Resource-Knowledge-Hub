import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, SEED_USERS } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('CRKH_USER');
      return saved ? JSON.parse(saved) : SEED_USERS[0]; // Default to Student 1 for seamless preview
    } catch (e) {
      return SEED_USERS[0];
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('CRKH_AUTH_TOKEN') || 'demo-token-active';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('CRKH_USER', JSON.stringify(user));
    } else {
      localStorage.removeItem('CRKH_USER');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('CRKH_AUTH_TOKEN', token);
      document.cookie = `CRKH_AUTH_TOKEN=${token}; path=/; max-age=86400; SameSite=Lax`;
    } else {
      localStorage.removeItem('CRKH_AUTH_TOKEN');
      document.cookie = 'CRKH_AUTH_TOKEN=; path=/; max-age=0;';
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res && res.user) {
      setUser(res.user);
      setToken(res.token || 'jwt-' + Date.now());
      return res.user;
    }
    throw new Error('Invalid email or password');
  };

  const register = async (data) => {
    const res = await api.register(data);
    if (res && res.user) {
      setUser(res.user);
      setToken(res.token || 'jwt-' + Date.now());
      return res.user;
    }
    throw new Error('Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const switchDemoUser = (email) => {
    const found = SEED_USERS.find(u => u.email === email) || SEED_USERS[0];
    setUser(found);
    setToken('jwt-demo-' + found.id);
  };

  const boostReputation = (points = 5) => {
    if (user) {
      const updated = { ...user, reputation: (user.reputation || 100) + points };
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      switchDemoUser,
      boostReputation
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
