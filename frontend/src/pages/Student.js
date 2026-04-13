import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/Auth.context';
import axios from '../axiosConfig';

const Student = () => {
  const { user, logout } = useAuth();
  const [placement, setPlacement] = useState(null);
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ week_number: '', activities: '', challenges: '', learnings: '' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      const placementsRes = await axios.get('/api/Internship_Placement/');
      const myPlacement = placementsRes.data.find((p) => p.student === user.id);
      setPlacement(myPlacement || null);

      if (myPlacement) {
        const logsRes = await axios.get(`/api/Weekly_Log/?placement=${myPlacement.id}`);
        setLogs(logsRes.data);
      }
    } catch {
      showMessage('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!placement) {
      showMessage('No active placement found. Please contact your administrator.', 'error');
      return;
    }
    if (form.week_number < 1 || form.week_number > 52) {
      showMessage('Week number must be between 1 and 52', 'error');
      return;
    }
    if (logs.find((l) => l.week_number === parseInt(form.week_number))) {
      showMessage(`Log for Week ${form.week_number} already submitted`, 'error');
      return;
    }
    try {
      await axios.post('/api/Weekly_Log/', {
        placement: placement.id,
        week_number: parseInt(form.week_number),
        activities: form.activities,
        challenges: form.challenges,
        learnings: form.learnings,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      });
      showMessage(`Week ${form.week_number} log submitted successfully!`);
      setForm({ week_number: '', activities: '', challenges: '', learnings: '' });
      fetchData();
    } catch {
      showMessage('Failed to submit log', 'error');
    }
  };

  const statusBadge = (status) => {
    const map = { draft: 'badge-pending', submitted: 'badge-submitted', reviewed: 'badge-reviewed' };
    return <span className={`badge ${map[status] || 'badge-pending'}`}>{status}</span>;
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <header className="app-header">
        <h1>Student Dashboard</h1>
        <span>Welcome, {user.first_name || user.username}</span>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </header>
      <div className="container" style={{ paddingTop: 24 }}>
        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        <div className="card">
          <h2>Submit Weekly Log</h2>
          {!placement && <p style={{ color: '#dc3545', marginBottom: 16 }}>No active placement found. Contact your administrator.</p>}
          <form onSubmit={handleSubmit}>
            <input
              name="week_number" type="number" placeholder="Week Number (1-52)"
              value={form.week_number} onChange={handleChange} min="1" max="52" required
            />
            <textarea
              name="activities" placeholder="Describe activities done this week..."
              value={form.activities} onChange={handleChange} rows="4" required
            />
            <textarea
              name="challenges" placeholder="Challenges faced..."
              value={form.challenges} onChange={handleChange} rows="3" required
            />
            <textarea
              name="learnings" placeholder="Key learnings and takeaways..."
              value={form.learnings} onChange={handleChange} rows="3"
            />
            <button type="submit" disabled={!placement}>Submit Log</button>
          </form>
        </div>

        <div className="card">
          <h2>My Submitted Logs</h2>
          {logs.length === 0 ? (
            <p>No logs submitted yet.</p>
          ) : (
            [...logs].sort((a, b) => b.week_number - a.week_number).map((log) => (
              <div key={log.id} className="log-item">
                <div className="log-item-header">
                  <h4>Week {log.week_number}</h4>
                  {statusBadge(log.status)}
                </div>
                <p><strong>Activities:</strong> {log.activities}</p>
                <p><strong>Challenges:</strong> {log.challenges}</p>
                {log.learnings && <p><strong>Learnings:</strong> {log.learnings}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Student;
