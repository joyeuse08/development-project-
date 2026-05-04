import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [logs, setLogs] = useState([]);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    // Fetch all users
    axios.get('/api/users/')
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));

    // Fetch all placements
    axios.get('/api/Internship_Placement/')
      .then(res => setPlacements(res.data))
      .catch(err => console.log(err));

    // Fetch all weekly logs
    axios.get('/api/Weekly_Log/')
      .then(res => setLogs(res.data))
      .catch(err => console.log(err));

    // Fetch all issues
    axios.get('/api/issues/')
      .then(res => setIssues(res.data))
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
        <h1>Admin Dashboard</h1>
        <div>
          <span>Welcome, {user?.username}!</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Navigation */}
      <div className="dashboard-nav">
        <button onClick={() => navigate('/internship_placement')}>
          Placements
        </button>
        <button onClick={() => navigate('/weekly_log')}>
          Weekly Logs
        </button>
        <button onClick={() => navigate('/issues')}>
          Issues
        </button>
        <button onClick={() => navigate('/weighted_score')}>
          Weighted Scores
        </button>
        <button onClick={() => navigate('/notifications')}>
          Notifications
        </button>
      </div>

      {/* Stats overview */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Placements</h3>
          <p>{placements.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Logs</h3>
          <p>{logs.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Issues</h3>
          <p>{issues.length}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="dashboard-content">

        {/* Users table */}
        <div className="dashboard-card">
          <h2>All Users</h2>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Placements table */}
        <div className="dashboard-card">
          <h2>All Internship Placements</h2>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Company</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {placements.map(p => (
                <tr key={p.id}>
                  <td>{p.student}</td>
                  <td>{p.company_name}</td>
                  <td>{p.status}</td>
                  <td>{p.start_date}</td>
                  <td>{p.end_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Issues table */}
        <div className="dashboard-card">
          <h2>All Issues</h2>
          <table>
            <thead>
              <tr>
                <th>Issue Type</th>
                <th>Status</th>
                <th>Student</th>
              </tr>
            </thead>
            <tbody>
              {issues.map(i => (
                <tr key={i.id}>
                  <td>{i.issue_type}</td>
                  <td>{i.status}</td>
                  <td>{i.student}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
