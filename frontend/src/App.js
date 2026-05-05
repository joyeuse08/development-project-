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
import {useAuth} from './context/AuthContext';
import './App.css';


function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/weekly-logs" element={<PrivateRoute><WeeklyLog /></PrivateRoute>}/>
        <Route path="/academic-feedback" element={<PrivateRoute><AcademicFeedback /></PrivateRoute>}/>
        <Route path="/supervisor-feedback" element={<PrivateRoute><SupervisorFeedback /></PrivateRoute>}/>
        <Route path="/internship-placement" element={<PrivateRoute><InternshipPlacement /></PrivateRoute>}/>
        <Route path="/weighted-score" element={<PrivateRoute><WeightedScore /></PrivateRoute>}/>
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>}/>
        <Route path="/issues" element={<PrivateRoute><Issues /></PrivateRoute>} />
        <Route path="/internship_placement" element={<PrivateRoute><InternshipPlacement /></PrivateRoute>} />
        <Route path="/weekly_log" element={<PrivateRoute><WeeklyLog /></PrivateRoute>} />
        <Route path="/supervisor_feedback" element={<PrivateRoute><SupervisorFeedback /></PrivateRoute>} />
        <Route path="/academic_feedback" element={<PrivateRoute><AcademicFeedback /></PrivateRoute>} />
        <Route path="/weighted_score" element={<PrivateRoute><WeightedScore /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
