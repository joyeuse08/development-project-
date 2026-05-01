
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NAV_LINKS = {
  student: [
    { label: '📋 Weekly Logs', path: '/weekly-logs' },
    { label: '🔔 Notifications', path: '/notifications' },
    { label: '⚠️ Issues', path: '/issues' },
  ],
  workplace: [
    { label: '📋 Weekly Logs', path: '/weekly-logs' },
    { label: '🔔 Notifications', path: '/notifications' },
    { label: '⚠️ Issues', path: '/issues' },
  ],
  academic: [
    { label: '🎓 Academic Feedback', path: '/academic-feedback' },
    { label: '🔔 Notifications', path: '/notifications' },
    { label: '⚠️ Issues', path: '/issues' },
  ],
  admin: [
    { label: '📋 Weekly Logs', path: '/weekly-logs' },
    { label: '🎓 Academic Feedback', path: '/academic-feedback' },
    { label: '🔔 Notifications', path: '/notifications' },
    { label: '⚠️ Issues', path: '/issues' },
  ],
};

const ROLE_LABELS = {
  student: 'Student Intern',
  workplace: 'Workplace Supervisor',
  academic: 'Academic Supervisor',
  admin: 'Administrator',
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = NAV_LINKS[user?.role] || [];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Welcome, {user?.username}</h1>
          <p style={styles.role}>{ROLE_LABELS[user?.role] || user?.role}</p>
        </div>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>
      <div style={styles.grid}>
        {links.map(({ label, path }) => (
          <button key={path} onClick={() => navigate(path)} style={styles.navCard}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: { fontFamily: "'DM Sans', sans-serif", maxWidth: 900, margin: '0 auto', padding: '40px 20px', background: '#f8f9fb', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 },
  title: { margin: '0 0 4px', fontSize: 28, fontWeight: 700, color: '#1a1a2e' },
  role: { margin: 0, fontSize: 14, color: '#888' },
  logoutBtn: { background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 },
  navCard: { background: '#fff', border: '1.5px solid #f0f0f0', borderRadius: 12, padding: '28px 20px', fontSize: 15, fontWeight: 600, color: '#1a1a2e', cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s' },
};

export default Dashboard;
