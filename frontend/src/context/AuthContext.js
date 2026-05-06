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
      const token = localStorage.getItem('token');
      if (saved) setUser(JSON.parse(saved));
      if (token) api.defaults.headers.common['Authorization'] = `Token ${token}`;
    } catch (err) {
      console.error('Failed to load user from localStorage:', err);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const { data } = await api.post('/api/login/', { username, password });
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Token ${data.token}`;
      return true;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
        try { await api.post('/api/logout/'); } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
    }
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };
 const register = async (username, email, password, department = '', role = 'student', student_number = '', staff_number = '') => {
    try {
      setLoading(true);
      await api.post('/api/register/', { username, email, password, department, role, student_number, staff_number });
      return { success: true };
    } catch (err) {
      return { success: false, errors: err.response?.data || {} };
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
