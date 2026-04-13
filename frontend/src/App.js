import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/Auth.context';
import './App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dash.board';
import Student from './pages/Student';
import WorkplaceSupervisor from './pages/WorkplaceSupervisor';
import AcademicSupervisor from './pages/AcademicSupervisor';
import Admin from './pages/Admin';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/student"
          element={
            <PrivateRoute roles={['student']}>
              <Student />
            </PrivateRoute>
          }
        />
        <Route
          path="/workplace"
          element={
            <PrivateRoute roles={['workplace']}>
              <WorkplaceSupervisor />
            </PrivateRoute>
          }
        />
        <Route
          path="/academic"
          element={
            <PrivateRoute roles={['academic']}>
              <AcademicSupervisor />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={['admin']}>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
