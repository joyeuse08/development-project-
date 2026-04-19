import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Optional: try to restore login from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('user');
      if (saved) setUser(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const login = async (username, password) => {
    // Minimal placeholder auth so the app compiles + navigates.
    // Replace with real API call when backend auth endpoint is ready.
    const nextUser = { username };
    setUser(nextUser);
    try {
      localStorage.setItem('user', JSON.stringify(nextUser));
    } catch {
      // ignore
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('user');
    } catch {
      // ignore
    }
  };

  const value = { user, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
