import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/Auth.context';
import axios from '../axiosConfig';

const STAT_COLORS = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#f5a623', '#e74c3c'];

const Admin = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, logsRes] = await Promise.all([
          axios.get('/api/users/'),
          axios.get('/api/Weekly_Log/'),
        ]);
        setUsers(usersRes.data);
        setLogs(logsRes.data);
      } catch {
        showMessage('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const stats = [
    { label: 'Students', value: users.filter((u) => u.role === 'student').length },
    { label: 'Workplace Supervisors', value: users.filter((u) => u.role === 'workplace').length },
    { label: 'Academic Supervisors', value: users.filter((u) => u.role === 'academic').length },
    { label: 'Total Logs', value: logs.length },
    { label: 'Submitted', value: logs.filter((l) => l.status === 'submitted').length },
    { label: 'Reviewed', value: logs.filter((l) => l.status === 'reviewed').length },
  ];

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <header className="app-header">
        <h1>Admin Dashboard</h1>
        <span>Welcome, {user.first_name || user.username}</span>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </header>
      <div className="container" style={{ paddingTop: 24 }}>
        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        <div className="card">
          <h2>System Statistics</h2>
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={s.label} className="stat-card" style={{ background: STAT_COLORS[i % STAT_COLORS.length] }}>
                <h3>{s.label}</h3>
                <p>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>All Users</h2>
          {users.length === 0 ? (
            <p>No users registered.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.first_name} {u.last_name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h2>All Weekly Logs</h2>
          {logs.length === 0 ? (
            <p>No logs submitted yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Placement</th>
                  <th>Week</th>
                  <th>Status</th>
                  <th>Activities</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id}>
                    <td>{l.placement}</td>
                    <td>{l.week_number}</td>
                    <td>{l.status}</td>
                    <td>{l.activities.substring(0, 80)}{l.activities.length > 80 ? '...' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Admin;
