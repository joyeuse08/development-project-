import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

function AcademicSupervisorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [placements, setPlacements] = useState([]);
  const [academicFeedbacks, setAcademicFeedbacks] = useState([]);
  const [weightedScores, setWeightedScores] = useState([]);

  useEffect(() => {
    // Fetch all internship placements
    axios.get('/api/Internship_Placement/')
      .then(res => setPlacements(res.data))
      .catch(err => console.log(err));

    // Fetch academic feedbacks given by this supervisor
    axios.get('/api/Academic_Supervisor_Feedback/')
      .then(res => setAcademicFeedbacks(res.data))
      .catch(err => console.log(err));

    // Fetch weighted scores
    axios.get('/api/Weighted_Score/')
      .then(res => setWeightedScores(res.data))
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
        <h1>Academic Supervisor Dashboard</h1>
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
        <button onClick={() => navigate('/academic_feedback')}>
          Give Feedback
        </button>
        <button onClick={() => navigate('/weighted_score')}>
          Weighted Scores
        </button>
        <button onClick={() => navigate('/notifications')}>
          Notifications
        </button>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Placements</h3>
          <p>{placements.length}</p>
        </div>
        <div className="stat-card">
          <h3>Feedbacks Given</h3>
          <p>{academicFeedbacks.length}</p>
        </div>
        <div className="stat-card">
          <h3>Scores Given</h3>
          <p>{weightedScores.length}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="dashboard-content">

        {/* Internship placements */}
        <div className="dashboard-card">
          <h2>Internship Placements</h2>
          {placements.length === 0 ? (
            <p>No placements found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Company</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {placements.map(p => (
                  <tr key={p.id}>
                    <td>{p.student}</td>
                    <td>{p.company_name}</td>
                    <td>{p.start_date}</td>
                    <td>{p.end_date}</td>
                    <td>{p.status}</td>
                    <td>
                      <button onClick={() => navigate('/academic_feedback')}>
                        Give Feedback
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Academic feedbacks */}
        <div className="dashboard-card">
          <h2>My Academic Feedbacks</h2>
          {academicFeedbacks.length === 0 ? (
            <p>No feedback given yet.</p>
          ) : (
            academicFeedbacks.map(f => (
              <div key={f.id}>
                <p><strong>Comments:</strong> {f.comments}</p>
                <p><strong>Score:</strong> {f.academic_score}</p>
              </div>
            ))
          )}
          <button onClick={() => navigate('/academic_feedback')}>
            Add New Feedback
          </button>
        </div>

        {/* Weighted scores */}
        <div className="dashboard-card">
          <h2>Weighted Scores</h2>
          {weightedScores.length === 0 ? (
            <p>No scores given yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {weightedScores.map(s => (
                  <tr key={s.id}>
                    <td>{s.student}</td>
                    <td>{s.final_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button onClick={() => navigate('/weighted_score')}>
            Add Score
          </button>
        </div>

      </div>
    </div>
  );
}

export default AcademicSupervisorDashboard;