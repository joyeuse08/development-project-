import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Issues from './pages/Issues';
import InternshipPlacement from './pages/InternshipPlacement';
import WeeklyLog from './pages/WeeklyLog';
import SupervisorFeedback from './pages/SupervisorFeedback';
import AcademicFeedback from './pages/AcademicFeedback';
import WeightedScore from './pages/WeightedScore';
import Notifications from './pages/Notifications';
import {useAuth} from './context/AuthContext'; import './App.css';
import { Navigate } from 'react-router-dom';


function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light"/> 
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/weekly-logs" element={<PrivateRoute><WeeklyLog /></PrivateRoute>}/>
        <Route path="/academic-feedback" element={<PrivateRoute><AcademicFeedback /></PrivateRoute>}/>
        <Route path="/supervisor-feedback" element={<PrivateRoute><SupervisorFeedback /></PrivateRoute>}/>
        <Route path="/internship-placement" element={<PrivateRoute><InternshipPlacement /></PrivateRoute>}/>
        <Route path="/weighted-score" element={<PrivateRoute><WeightedScore /></PrivateRoute>}/>
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/internship_placement" element={<InternshipPlacement />} />
        <Route path="/weekly_log" element={<WeeklyLog />} />
        <Route path="/supervisor_feedback" element={<SupervisorFeedback />} />
        <Route path="/academic_feedback" element={<AcademicFeedback />} />
        <Route path="/weighted_score" element={<WeightedScore />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}

export default App;
