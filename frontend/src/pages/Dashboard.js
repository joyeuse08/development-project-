
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import AcademicSupervisorDashboard from './AcademicSupervisorDashboard';
import WorkplaceSupervisorDashboard from './WorkplaceSupervisorDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === "academic") {
    return <AcademicDashboardView />;
  }
  if (user?.role === "workplace") {
    return <WorkplaceDashboardView />;
  }
  if (user?.role === "admin") {
    return <AdminDashboardView />;
  }
  return <StudentDashboardView />;
};

export default Dashboard;
