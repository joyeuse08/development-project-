import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function WorkplaceSupervisorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Data from three endpoints
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [studentLogs, setStudentLogs] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]); 

  // Combined list for review
  const [reviewItems, setReviewItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [feedbackInputs, setFeedbackInputs] = useState({});
  const [loading, setLoading] = useState(true);

  const combineLogs = (weekly, daily) => {
    const weeklyItems = weekly.map(log => ({
      id: `weekly_${log.id}`,
      originalId: log.id,
      type: 'weekly',
      studentName: log.student_name || 'Student', // adjust field name if needed
      weekOrDate: `Week ${log.week_number}`,
      title: log.activities?.substring(0, 60) || 'Weekly report',
      content: log.challenges || '',
      status: log.status || 'submitted',
      original: log,
    }));

    const dailyItems = daily.map(log => ({
      id: `daily_${log.id}`,
      originalId: log.id,
      type: 'daily',
      studentName: log.student_name || 'Student',
      weekOrDate: log.date || 'Unknown date',
      title: log.description?.substring(0, 60) || 'Daily log',
      content: `${log.hours || 0} hours`,
      status: log.status || 'submitted',
      original: log,
    }));

    return [...weeklyItems, ...dailyItems];
  };

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [weeklyRes, dailyRes, feedbackRes] = await Promise.all([
        axios.get('/api/Weekly_Log/'),
        axios.get('/api/Student_log/'),
        axios.get('/api/Supervisor_Feedback/'),
      ]);

      const weekly = Array.isArray(weeklyRes.data) ? weeklyRes.data : weeklyRes.data.results || [];
      const daily = Array.isArray(dailyRes.data) ? dailyRes.data : dailyRes.data.results || [];
      const fb = Array.isArray(feedbackRes.data) ? feedbackRes.data : feedbackRes.data.results || [];

      setWeeklyLogs(weekly);
      setStudentLogs(daily);
      setFeedbacks(fb);
      setReviewItems(combineLogs(weekly, daily));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Client‑side filtering by status
  const filteredItems = statusFilter
    ? reviewItems.filter(item => item.status === statusFilter)
    : reviewItems;

  // Update feedback for a specific review item
  const handleFeedbackChange = (itemId, value) => {
    setFeedbackInputs(prev => ({ ...prev, [itemId]: value }));
  };

  // Update status + feedback for an item (calls appropriate endpoint)
  const updateLogStatus = async (item, newStatus) => {
    const feedback = feedbackInputs[item.id] || '';
    const endpoint = item.type === 'weekly'
      ? `/api/Weekly_Log/${item.originalId}/`
      : `/api/Student_log/${item.originalId}/`;

    try {
      await axios.patch(endpoint, {
        status: newStatus,
        feedback: feedback,
      });
      await fetchAllData();
      setFeedbackInputs(prev => ({ ...prev, [item.id]: '' }));
      toast.success(`Log ${newStatus} successfully!`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update. Check console for details.`);
    }
  };

  const handleApprove = (item) => updateLogStatus(item, 'approved');
  const handleReject = (item) => updateLogStatus(item, 'rejected');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard supervisor-dashboard" style={{ fontFamily: 'Segoe UI, sans-serif', padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: '15px', marginBottom: '25px' }}>
        <h1>Supervisor Dashboard – Review Logs</h1>
        <div>
          <span>Welcome, {user?.username || 'Supervisor'}</span>
          <button onClick={handleLogout} style={{ marginLeft: '15px', padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      {/* Stats (optional) */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', flex: 1 }}>
          <h3>Weekly Logs</h3>
          <p>{weeklyLogs.length}</p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', flex: 1 }}>
          <h3>Daily Logs</h3>
          <p>{studentLogs.length}</p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', flex: 1 }}>
          <h3>Feedbacks Given</h3>
          <p>{feedbacks.length}</p>
        </div>
      </div>

      {/* Status Filter */}
      <div style={{ marginBottom: '25px', backgroundColor: '#f8f9fa', padding: '12px 20px', borderRadius: '8px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Filter by status:</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="">All logs</option>
          <option value="submitted">Submitted</option>
          <option value="review">In review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Logs Table */}
      <div style={{ overflowX: 'auto' }}>
        <h2>Logs Assigned to You</h2>
        {loading && <p>Loading logs...</p>}
        {!loading && filteredItems.length === 0 && <p>No logs found for the selected filter.</p>}

        {!loading && filteredItems.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={thStyle}>Student</th>
                <th style={thStyle}>Week / Date</th>
                <th style={thStyle}>Title / Content</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Your Feedback</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td style={tdStyle}>{item.studentName}</td>
                  <td style={tdStyle}>{item.weekOrDate}</td>
                  <td style={tdStyle}>
                    <strong>{item.title}</strong>
                    <br />
                    <small>{item.content}</small>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      backgroundColor: 
                        item.status === 'approved' ? '#28a745' :
                        item.status === 'rejected' ? '#dc3545' :
                        item.status === 'review' ? '#17a2b8' : '#ffc107',
                      color: item.status === 'submitted' ? '#333' : 'white',
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <textarea
                      rows="2"
                      placeholder="Write feedback here..."
                      value={feedbackInputs[item.id] || ''}
                      onChange={(e) => handleFeedbackChange(item.id, e.target.value)}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleApprove(item)}
                      disabled={item.status === 'approved'}
                      style={{
                        marginRight: '8px',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundColor: '#28a745',
                        color: 'white',
                        opacity: item.status === 'approved' ? 0.6 : 1,
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(item)}
                      disabled={item.status === 'rejected'}
                      style={{
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        opacity: item.status === 'rejected' ? 0.6 : 1,
                      }}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Previous Feedbacks (optional) */}
      <div style={{ marginTop: '40px' }}>
        <h3>Previously Given Feedback</h3>
        {feedbacks.length === 0 ? (
          <p>No feedback given yet.</p>
        ) : (
          <ul>
            {feedbacks.map(fb => (
              <li key={fb.id}><strong>Score:</strong> {fb.supervisor_score} – {fb.comments}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const thStyle = { border: '1px solid #e0e0e0', padding: '12px', textAlign: 'left', fontWeight: 600 };
const tdStyle = { border: '1px solid #e0e0e0', padding: '12px', verticalAlign: 'top' };

export default WorkplaceSupervisorDashboard;