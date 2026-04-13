import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth.context';

const ROLE_ROUTES = {
  student: '/student',
  workplace: '/workplace',
  academic: '/academic',
  admin: '/admin',
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const route = ROLE_ROUTES[user.role] || '/login';
      navigate(route, { replace: true });
    }
  }, [user, navigate]);

  return <div className="loading">Redirecting...</div>;
};

export default Dashboard;
