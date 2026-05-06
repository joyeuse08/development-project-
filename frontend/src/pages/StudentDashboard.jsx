import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [placements, setPlacements] = useState([]);
  const [logs, setLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch student's placements
    axios.get('/api/Internship_Placement/')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data :
                     Array.isArray(res.data.results) ? res.data.results : [];
        setPlacements(data);
      })
      .catch(err => console.log(err));

    // Fetch student's weekly logs
    axios.get('/api/Weekly_Log/')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data :
                     Array.isArray(res.data.results) ? res.data.results : [];
        setLogs(data);
      })
      .catch(err => console.log(err));

    // Fetch notifications
    axios.get('/api/notifications/')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data :
                     Array.isArray(res.data.results) ? res.data.results : [];
        setNotifications(data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div>
          <span>Welcome, {user?.username}!</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Navigation */}
      <div className="dashboard-nav">
        <button onClick={() => navigate('/weekly_log')}>
          Weekly Logs
        </button>
        <button onClick={() => navigate('/internship_placement')}>
          My Placement
        </button>
        <button onClick={() => navigate('/issues')}>
          Issues
        </button>
        <button onClick={() => navigate('/notifications')}>
          Notifications {notifications.length > 0 && 
            <span>({notifications.length})</span>}
        </button>
      </div>

      {/* Main content */}
      <div className="dashboard-content">

        {/* Placement summary */}
        <div className="dashboard-card">
          <h2>My Internship Placement</h2>
          {placements.length === 0 ? (
            <p>No placement found.</p>
          ) : (
            placements.map(p => (
              <div key={p.id}>
                <p><strong>Company:</strong> {p.company_name}</p>
                <p><strong>Status:</strong> {p.status}</p>
                <p><strong>Start:</strong> {p.start_date}</p>
                <p><strong>End:</strong> {p.end_date}</p>
              </div>
            ))
          )}
        </div>

        {/* Weekly logs summary */}
        <div className="dashboard-card">
          <h2>My Weekly Logs</h2>
          {logs.length === 0 ? (
            <p>No logs submitted yet.</p>
          ) : (
            logs.map(log => (
              <div key={log.id}>
                <p><strong>Week {log.week_number}</strong> — {log.status}</p>
              </div>
            ))
          )}
          <button onClick={() => navigate('/weekly_log')}>
            Add New Log
          </button>
        </div>

        {/* Notifications summary */}
        <div className="dashboard-card">
          <h2>Recent Notifications</h2>
          {notifications.length === 0 ? (
            <p>No notifications.</p>
          ) : (
            notifications.slice(0, 5).map(n => (
              <div key={n.id}>
                <p>{n.message}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;
