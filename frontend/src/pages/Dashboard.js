
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import AcademicSupervisorDashboard from './AcademicSupervisorDashboard';
import WorkplaceSupervisorDashboard from './WorkplaceSupervisorDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  switch (user.role) {
    case 'student':               return <StudentDashboard />;
    case 'admin':                 return <AdminDashboard />;
    case 'academic_supervisor':   return <AcademicSupervisorDashboard />;
    case 'workplace_supervisor':  return <WorkplaceSupervisorDashboard />;
    default:                      return <Navigate to="/login" replace />;
  }
};

export default Dashboard;
