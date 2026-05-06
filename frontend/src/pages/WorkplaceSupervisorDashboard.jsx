import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

function WorkplaceSupervisorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [studentLogs, setStudentLogs] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    // Fetch weekly logs assigned to this supervisor
    axios.get('/api/Weekly_Log/')
      .then(res => setWeeklyLogs(res.data))
      .catch(err => console.log(err));

    // Fetch student daily logs
    axios.get('/api/Student_log/')
      .then(res => setStudentLogs(res.data))
      .catch(err => console.log(err));

    // Fetch feedbacks given by this supervisor
    axios.get('/api/Supervisor_Feedback/')
      .then(res => setFeedbacks(res.data))
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
        <h1>Workplace Supervisor Dashboard</h1>
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
        <button onClick={() => navigate('/supervisor_feedback')}>
          Give Feedback
        </button>
        <button onClick={() => navigate('/notifications')}>
          Notifications
        </button>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Weekly Logs</h3>
          <p>{weeklyLogs.length}</p>
        </div>
        <div className="stat-card">
          <h3>Daily Logs</h3>
          <p>{studentLogs.length}</p>
        </div>
        <div className="stat-card">
          <h3>Feedbacks Given</h3>
          <p>{feedbacks.length}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="dashboard-content">

        {/* Weekly logs to review */}
        <div className="dashboard-card">
          <h2>Weekly Logs to Review</h2>
          {weeklyLogs.length === 0 ? (
            <p>No weekly logs to review.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Activities</th>
                  <th>Challenges</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {weeklyLogs.map(log => (
                  <tr key={log.id}>
                    <td>Week {log.week_number}</td>
                    <td>{log.activities}</td>
                    <td>{log.challenges}</td>
                    <td>{log.status}</td>
                    <td>
                      <button onClick={() => navigate('/supervisor_feedback')}>
                        Give Feedback
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Daily student logs */}
        <div className="dashboard-card">
          <h2>Student Daily Logs</h2>
          {studentLogs.length === 0 ? (
            <p>No daily logs found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {studentLogs.map(log => (
                  <tr key={log.id}>
                    <td>{log.date}</td>
                    <td>{log.description}</td>
                    <td>{log.hours}</td>
                    <td>{log.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Feedbacks given */}
        <div className="dashboard-card">
          <h2>My Feedbacks</h2>
          {feedbacks.length === 0 ? (
            <p>No feedback given yet.</p>
          ) : (
            feedbacks.map(f => (
              <div key={f.id}>
                <p><strong>Comments:</strong> {f.comments}</p>
                <p><strong>Score:</strong> {f.supervisor_score}</p>
              </div>
            ))
          )}
          <button onClick={() => navigate('/supervisor_feedback')}>
            Add New Feedback
          </button>
        </div>

      </div>
    </div>
  );
}

export default WorkplaceSupervisorDashboard;