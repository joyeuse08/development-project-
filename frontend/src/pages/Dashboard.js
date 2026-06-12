
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import AcademicSupervisorDashboard from './AcademicSupervisorDashboard';
import WorkplaceSupervisorDashboard from './WorkplaceSupervisorDashboard';

const StudentDashboardView = () => (
  <div>
    <h2>Student Dashboard</h2>
    <p>Welcome! Track your internship progress and submit your weekly logs here.</p>
    {/* Your existing student dashboard HTML/components go here */}
  </div>
);

const AcademicDashboardView = () => (
  <div>
    <h2>Academic Supervisor Dashboard</h2>
    <p>Review student placements, view weekly logs, and submit academic feedback.</p>
  </div>
);

const WorkplaceDashboardView = () => (
  <div>
    <h2>Workplace Supervisor Dashboard</h2>
    <p>Manage intern attendance, read weekly logs, and submit workplace feedback.</p>
  </div>
);

const AdminDashboardView = () => (
  <div>
    <h2>Admin Dashboard</h2>
    <p>System configuration, user management, and global internship statistics.</p>
  </div>
);

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
