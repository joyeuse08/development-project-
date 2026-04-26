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
      const token = localStorage.getitem('token');
      if (saved) setUser(JSON.parse(saved));
      if (token) api.defaults.headers.common['Authorization'] = `Token ${token}`;
    } catch {}
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const { data } = await api.post('/api/login/', { username, password });
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setname('token', data.token);
      api.defaults.headers.common['Authorization'] = `Token ${data.token}`;
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
        try { await api.post('/api/logout/'); } catch {}
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };
  const register = async (username, email, password) => {
    try {
      setLoading(true);
      await api.post('/api/register/', { username, email, password });
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
