import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/Auth.context';
import axios from '../axiosConfig';

const AcademicSupervisor = () => {
  const { user, logout } = useAuth();
  const [placements, setPlacements] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ comments: '', academic_score: '' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchPlacements = useCallback(async () => {
    try {
      const res = await axios.get('/api/Internship_Placement/');
      const supervised = res.data.filter((p) => p.academic_supervisor === user.id);
      setPlacements(supervised);
    } catch {
      showMessage('Failed to load placements', 'error');
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => { fetchPlacements(); }, [fetchPlacements]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const score = parseFloat(form.academic_score);
    if (score < 0 || score > 10) {
      showMessage('Score must be between 0 and 10', 'error');
      return;
    }
    try {
      await axios.post('/api/Academic_Supervisor_Feedback/', {
        placement: selected.id,
        academic_supervisor: user.id,
        comments: form.comments,
        academic_score: Math.round(score),
      });
      showMessage('Academic feedback submitted successfully!');
      setSelected(null);
      setForm({ comments: '', academic_score: '' });
    } catch {
      showMessage('Failed to submit feedback', 'error');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <header className="app-header">
        <h1>Academic Supervisor Dashboard</h1>
        <span>Welcome, {user.first_name || user.username}</span>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </header>
      <div className="container" style={{ paddingTop: 24 }}>
        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        {selected && (
          <div className="card">
            <h2>Academic Review — {selected.company_name}</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                name="comments" placeholder="Write academic feedback..." rows="4"
                value={form.comments} onChange={handleChange} required
              />
              <input
                name="academic_score" type="number" placeholder="Score (0-10)"
                value={form.academic_score} onChange={handleChange}
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
          <h2>My Supervised Placements</h2>
          {placements.length === 0 ? (
            <p>No placements assigned to you.</p>
          ) : (
            placements.map((p) => (
              <div key={p.id} className="log-item">
                <div className="log-item-header">
                  <h4>{p.company_name}</h4>
                  <span className={`badge ${p.status === 'active' ? 'badge-submitted' : 'badge-reviewed'}`}>
                    {p.status}
                  </span>
                </div>
                <p><strong>Student ID:</strong> {p.student}</p>
                <p><strong>Period:</strong> {p.start_date} – {p.end_date}</p>
                <button
                  style={{ marginTop: 10, padding: '8px 20px', fontSize: 14 }}
                  onClick={() => { setSelected(p); setForm({ comments: '', academic_score: '' }); }}
                >
                  Submit Feedback
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AcademicSupervisor;
