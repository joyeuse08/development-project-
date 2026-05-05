
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import AcademicSupervisorDashboard from './AcademicSupervisorDashboard';
import WorkplaceSupervisorDashboard from './WorkplaceSupervisorDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'student':   return <StudentDashboard />;
    case 'admin':     return <AdminDashboard />;
    case 'academic':  return <AcademicSupervisorDashboard />;
    case 'workplace': return <WorkplaceSupervisorDashboard />;
    default:          return <Navigate to="/login" replace />;
  }
};

export default Dashboard;
