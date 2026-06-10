import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const StudentLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/Student_log/')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data :
                     Array.isArray(res.data.results) ? res.data.results : [];
        setLogs(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load logs');
        setLoading(false);
        console.log(err);
      });
  }, []);

  // Status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#27ae60';
      case 'submitted': return '#1e3a5f';
      case 'rejected': return '#e53935';
      case 'draft': return '#f39c12';
      default: return '#666';
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>My Daily Logs</h1>
        <div>
          <button onClick={() => navigate('/submit_log')}
            style={{marginRight: '10px'}}>
            + Add New Log
          </button>
          <button onClick={() => navigate('/student_dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>All My Logs</h2>

          {error && <p className="error">{error}</p>}

          {loading ? (
            <p>Loading logs...</p>
          ) : logs.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px'}}>
              <p style={{color: '#666', marginBottom: '20px'}}>
                No logs submitted yet.
              </p>
              <button onClick={() => navigate('/submit_log')}>
                Submit Your First Log
              </button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Hours</th>
                  <th>Challenges</th>
                  <th>Status</th>
                  <th>Attachment</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td>{log.date}</td>
                    <td>{log.description}</td>
                    <td>{log.hours}</td>
                    <td>{log.challenges || '—'}</td>
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
                    <td>
                      {log.attachment ? (
                        <a
                          href={log.attachment}
                          target="_blank"
                          rel="noreferrer"
                          style={{color: '#008080'}}
                        >
                          View
                        </a>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentLogs;