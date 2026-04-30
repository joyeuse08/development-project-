import React from 'react';
import{ BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dash.board';
import Issues from './pages/Issues';
import {useAuth} from './context/AuthContext'; import './App.css';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
        <Route path="/issues" element={<PrivateRoute><Issues /></PrivateRoute>}/>
      </Routes>
    </Router>
  );
}

export default App;
