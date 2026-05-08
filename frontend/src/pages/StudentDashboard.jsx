import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { notify } from '../utils/toastUtils';
import 'react-toastify/dist/ReactToastify.css';

function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [placements, setPlacements] = useState([]);
  const [logs, setLogs] = useState([]);
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch placements
    axios.get('/api/Internship_Placement/')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data :
                     Array.isArray(res.data.results) ? res.data.results : [];
        setPlacements(data);
      })
      .catch(err => console.log(err));

    // Fetch daily logs
    axios.get('/api/Student_log/')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data :
                     Array.isArray(res.data.results) ? res.data.results : [];
        setLogs(data);
      })
      .catch(err => {console.log(err);
      toast.error('Failed to load daily logs. Check console for details.');
      });

    // Fetch weekly logs
    axios.get('/api/Weekly_Log/')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data :
                     Array.isArray(res.data.results) ? res.data.results : [];
        setWeeklyLogs(data);
      })
      .catch(err => {console.log(err);
      toast.error('Failed to load weekly logs. Check console for details.');
      });

    // Fetch notifications
    axios.get('/api/notifications/')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data :
                     Array.isArray(res.data.results) ? res.data.results : [];
        setNotifications(data);
      })
      .catch(err => {console.log(err);
      toast.error('Failed to load notifications. Check console for details.');
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    notify('Logged out successfully!');
  };

  // Status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#27ae60';
      case 'submitted': return '#1e3a5f';
      case 'reviewed': return '#008080';
      case 'rejected': return '#e53935';
      case 'draft': return '#f39c12';
      default: return '#666';
    }
  };

  // Count logs by status
  const totalLogs = logs.length;
  const pendingLogs = logs.filter(l => l.status === 'submitted').length;
  const approvedLogs = logs.filter(l => l.status === 'approved').length;

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>🎓 ILES — Internship Logging & Evaluation System</h1>
        <div>
          <span>Welcome, <strong>{user?.username}</strong> | Your Internship Progress</span>
          <button onClick={handleLogout} style={{marginLeft: '15px'}}>
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="dashboard-nav">
        <button onClick={() => navigate('/submit_log')}>
          + Submit Daily Log
        </button>
        <button onClick={() => navigate('/submit_weekly_log')}>
          + Submit Weekly Log
        </button>
        <button onClick={() => navigate('/student_logs')}>
          My Logs
        </button>
        <button onClick={() => navigate('/internship_placement')}>
          My Placement
        </button>
        <button onClick={() => navigate('/issues')}>
          Issues
        </button>
        <button onClick={() => navigate('/notifications')}>
          Notifications {notifications.length > 0 &&
            `(${notifications.length})`}
        </button>
      </div>

      {/* Stats cards - like the lecture slide */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Logs</h3>
          <p>{totalLogs}</p>
          <small>Submitted Logs</small>
        </div>
        <div className="stat-card" style={{background: 'linear-gradient(135deg, #f39c12, #e67e22)'}}>
          <h3>Pending Reviews</h3>
          <p>{pendingLogs}</p>
          <small>Logs Pending</small>
        </div>
        <div className="stat-card" style={{background: 'linear-gradient(135deg, #27ae60, #2ecc71)'}}>
          <h3>Approved Logs</h3>
          <p>{approvedLogs}</p>
          <small>Logs Approved</small>
        </div>
      </div>

      {/* Main content */}
      <div className="dashboard-content">

        {/* My Internship Placement */}
        <div className="dashboard-card">
          <h2>My Internship Placement</h2>
          {placements.length === 0 ? (
            <p>No placement found.</p>
          ) : (
            placements.map(p => (
              <div key={p.id} style={{
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '10px'
              }}>
                <p><strong>Company:</strong> {p.company_name}</p>
                <p><strong>Status:</strong> {' '}
                  <span style={{
                    backgroundColor: getStatusColor(p.status),
                    color: 'white',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}>
                    {p.status}
                  </span>
                </p>
                <p><strong>Start:</strong> {p.start_date}</p>
                <p><strong>End:</strong> {p.end_date}</p>
              </div>
            ))
          )}
        </div>

        {/* My Internship Logs table - like lecture slide */}
        <div className="dashboard-card">
          <h2>My Internship Logs</h2>
          {logs.length === 0 ? (
            <div style={{textAlign: 'center', padding: '20px'}}>
              <p style={{color: '#666', marginBottom: '15px'}}>
                No logs submitted yet.
              </p>
              <button onClick={() => navigate('/submit_log')}>
                Submit Your First Log
              </button>
            </div>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Hours</th>
                    <th>Status</th>
                    <th>Supervisor Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id}>
                      <td>{log.date}</td>
                      <td>{log.description}</td>
                      <td>{log.hours}</td>
                      <td>
                        <span style={{
                          backgroundColor: getStatusColor(log.status),
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          {log.status}
                        </span>
                      </td>
                      <td style={{fontStyle: 'italic', color: '#555'}}>
                        {log.feedback || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => navigate('/student_logs')}
                style={{marginTop: '15px'}}
              >
                View All Logs
              </button>
            </>
          )}
        </div>

        {/* Weekly Logs */}
        <div className="dashboard-card">
          <h2>My Weekly Logs</h2>
          {weeklyLogs.length === 0 ? (
            <div style={{textAlign: 'center', padding: '20px'}}>
              <p style={{color: '#666', marginBottom: '15px'}}>
                No weekly logs submitted yet.
              </p>
              <button onClick={() => navigate('/submit_weekly_log')}>
                Submit Weekly Log
              </button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Activities</th>
                  <th>Learnings</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {weeklyLogs.map(log => (
                  <tr key={log.id}>
                    <td>Week {log.week_number}</td>
                    <td>{log.activities}</td>
                    <td>{log.learnings || '—'}</td>
                    <td>
                      <span style={{
                        backgroundColor: getStatusColor(log.status),
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Notifications */}
        <div className="dashboard-card">
          <h2>Recent Notifications</h2>
          {notifications.length === 0 ? (
            <p style={{color: '#666'}}>No notifications.</p>
          ) : (
            notifications.slice(0, 5).map(n => (
              <div key={n.id} className={`notification ${!n.is_read ? 'unread' : ''}`}>
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
