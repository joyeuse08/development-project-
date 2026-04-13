import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/Auth.context';
import axios from '../axiosConfig';

const WorkplaceSupervisor = () => {
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ comments: '', supervisor_score: '' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchLogs = useCallback(async () => {
    try {
      const res = await axios.get('/api/Weekly_Log/');
      setLogs(res.data.filter((l) => l.status === 'submitted'));
    } catch {
      showMessage('Failed to load logs', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const score = parseFloat(form.supervisor_score);
    if (score < 0 || score > 10) {
      showMessage('Score must be between 0 and 10', 'error');
      return;
    }
    try {
      await axios.post('/api/Supervisor_Feedback/', {
        weekly_log: selected.id,
        supervisor: user.id,
        comments: form.comments,
        supervisor_score: Math.round(score),
      });
      await axios.patch(`/api/Weekly_Log/${selected.id}/`, { status: 'reviewed' });
      showMessage('Feedback submitted successfully!');
      setSelected(null);
      setForm({ comments: '', supervisor_score: '' });
      fetchLogs();
    } catch {
      showMessage('Failed to submit feedback', 'error');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <header className="app-header">
        <h1>Workplace Supervisor Dashboard</h1>
        <span>Welcome, {user.first_name || user.username}</span>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </header>
      <div className="container" style={{ paddingTop: 24 }}>
        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        {selected && (
          <div className="card">
            <h2>Submit Feedback — Week {selected.week_number}</h2>
            <p style={{ marginBottom: 16 }}><strong>Activities:</strong> {selected.activities}</p>
            <p style={{ marginBottom: 16 }}><strong>Challenges:</strong> {selected.challenges}</p>
            <form onSubmit={handleSubmit}>
              <textarea
                name="comments" placeholder="Write feedback..." rows="4"
                value={form.comments} onChange={handleChange} required
              />
              <input
                name="supervisor_score" type="number" placeholder="Score (0-10)"
                value={form.supervisor_score} onChange={handleChange}
                min="0" max="10" step="0.1" required
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit">Submit Feedback</button>
                <button type="button" style={{ background: '#6c757d' }} onClick={() => setSelected(null)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          <h2>Pending Student Logs</h2>
          {logs.length === 0 ? (
            <p>No pending logs to review.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="log-item">
                <div className="log-item-header">
                  <h4>Placement #{log.placement} — Week {log.week_number}</h4>
                  <span className="badge badge-submitted">submitted</span>
                </div>
                <p><strong>Activities:</strong> {log.activities.substring(0, 200)}{log.activities.length > 200 ? '...' : ''}</p>
                <button
                  style={{ marginTop: 10, padding: '8px 20px', fontSize: 14 }}
                  onClick={() => { setSelected(log); setForm({ comments: '', supervisor_score: '' }); }}
                >
                  Review
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default WorkplaceSupervisor;
