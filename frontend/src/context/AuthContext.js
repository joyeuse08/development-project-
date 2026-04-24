import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../axiosConfig';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('user');
      if (saved) setUser(JSON.parse(saved));
    } catch {}
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const { data } = await api.post('/api/auth/login', { username, password });
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { await api.post('/api/auth/logout'); } catch {}
    setUser (null);
      localStorage.removeItem('user');
  }; 
  
const register = async (username, email, password) => {
    try {
      setLoading(true);
      await api.post('/api/auth/register', { username, email, password });
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
}; 
  
  
  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
