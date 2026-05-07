import React from 'react';
import{ BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Issues from './pages/Issues';
import InternshipPlacement from './pages/InternshipPlacement';
import WeeklyLog from './pages/WeeklyLog';
import WeeklyLogSubmission from './pages/WeeklyLogSubmission';
import StudentLog from './pages/StudentLog';
import StudentLogSubmission from './pages/StudentLogSubmission';
import SupervisorFeedback from './pages/SupervisorFeedback';
import AcademicFeedback from './pages/AcademicFeedback';
import WeightedScore from './pages/WeightedScore';
import Notifications from './pages/Notifications';
import StudentDashboard from './pages/StudentDashboard';
import WorkplaceSupervisorDashboard from './pages/WorkplaceSupervisorDashboard';
import AcademicSupervisorDashboard from './pages/AcademicSupervisorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LogSubmission from './pages/StudentLogSubmission';
import {useAuth} from './context/AuthContext';
import './App.css';

//opening dashboard based on roale of user
function RoleBasedRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'student') return <Navigate to="/student_dashboard" replace />;
  if (user.role === 'workplace') return <Navigate to="/workplace_supervisor_dashboard" replace />;
  if (user.role === 'academic') return <Navigate to="/academic_supervisor_dashboard" replace />;
  if (user.role === 'admin') return <Navigate to="/admin_dashboard" replace />;
  return <Navigate to="/login" replace />;
}

//protecting routes
function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Role redirect */}
        <Route path="/dashboard" element={<RoleBasedRedirect />} />
        {/* Student only */}
        <Route path="/student_dashboard" element={<PrivateRoute allowedRoles={['student']}><StudentDashboard /></PrivateRoute>} />
        {/* Workplace Supervisor only */}
        <Route path="/workplace_supervisor_dashboard" element={<PrivateRoute allowedRoles={['workplace']}><WorkplaceSupervisorDashboard /></PrivateRoute>} />
        {/* Academic Supervisor only */}
        <Route path="/academic_supervisor_dashboard" element={<PrivateRoute allowedRoles={['academic']}><AcademicSupervisorDashboard /></PrivateRoute>} />
        {/* Admin only */}
        <Route path="/admin_dashboard" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
        {/* Common routes for all authenticated users */}
        <Route path="/issues" element={<Issues />} />
        <Route path="/internship_placement" element={<InternshipPlacement />} />
        <Route path="/weekly_log" element={<WeeklyLog />} />
        <Route path="/submit_weeklylog" element={<PrivateRoute allowedRoles={['student']}><WeeklyLogSubmission /></PrivateRoute>} />
        <Route path="/supervisor_feedback" element={<SupervisorFeedback />} />
        <Route path="/academic_feedback" element={<AcademicFeedback />} />
        <Route path="/weighted_score" element={<WeightedScore />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/submit_studentlog" element={<PrivateRoute allowedRoles={['student']}><StudentLogSubmission /></PrivateRoute>} />
        <Route path= "/student_log" element={<StudentLog/>}/>
      </Routes>  
    </Router>
  );
}

export default App;
