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
  const [assigningId, setAssigningId] = useState(null);
  const [workplaceSupervisor, setWorkplaceSupervisor] = useState('');
  const [academicSupervisor, setAcademicSupervisor] = useState('');
  const [placementStatus, setPlacementStatus] = useState('pending');

  useEffect(() => {
    // Fetch all users
    axios.get('/api/users/?page_size=1000')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data :
                     Array.isArray(res.data.results) ? res.data.results : [];
        setUsers(data);
      })
      .catch(err => console.log(err));

    // Fetch all placements
    axios.get('/api/Internship_Placement/')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data :
                     Array.isArray(res.data.results) ? res.data.results : [];
        setPlacements(data);
      })
      .catch(err => console.log(err));

    // Fetch all weekly logs
    axios.get('/api/Weekly_Log/')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data :
                     Array.isArray(res.data.results) ? res.data.results : [];
        setLogs(data);
      })
      .catch(err => console.log(err));

    // Fetch all issues
    axios.get('/api/issues/')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data :
                     Array.isArray(res.data.results) ? res.data.results : [];
        setIssues(data);
      })
      .catch(err => console.log(err));
  }, []);

  const refetchPlacements = () => {
  axios.get('/api/Internship_Placement/')
    .then(res => {
      const data = Array.isArray(res.data) ? res.data :
                   Array.isArray(res.data.results) ? res.data.results : [];
      setPlacements(data);
    })
    .catch(err => console.log(err));
  };

  const openAssign = (p) => {
  setAssigningId(p.id);
  setWorkplaceSupervisor(p.workplace_supervisor || '');
  setAcademicSupervisor(p.academic_supervisor || '');
  setPlacementStatus(p.status || 'pending');
  };

  const cancelAssign = () => setAssigningId(null);

  const submitAssign = async () => {
    try {
      await axios.patch(`/api/Internship_Placement/${assigningId}/`, {
        workplace_supervisor: workplaceSupervisor || null,
        academic_supervisor: academicSupervisor || null,
        status: placementStatus,
      });
      setAssigningId(null);
      refetchPlacements();
    } catch (err) {
      console.error(err);
      alert('Failed to update placement: ' + JSON.stringify(err.response?.data));
    }
  };

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
        <button onClick={() => navigate('/internship-placement')}>
          Placements
        </button>
        <button onClick={() => navigate('/weekly-log')}>
          Weekly Logs
        </button>
        <button onClick={() => navigate('/issues')}>
          Issues
        </button>
        <button onClick={() => navigate('/weighted-score')}>
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
                <th>Workplace Supervisor</th>
                <th>Academic Supervisor</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {placements.map(p => (
                <React.Fragment key={p.id}>
                  <tr>
                    <td>{p.student_name || p.student}</td>
                    <td>{p.company_name}</td>
                    <td>{p.status}</td>
                    <td>{p.start_date}</td>
                    <td>{p.end_date}</td>
                    <td>{p.workplace_supervisor_username || 'Not assigned'}</td>
                    <td>{p.academic_supervisor_username || 'Not assigned'}</td>
                    <td>
                      <button onClick={() => openAssign(p)}>Assign</button>
                    </td>
                  </tr>
                  {assigningId === p.id && (
                    <tr>
                      <td colSpan="8">
                        <div style={{ padding: '12px', background: '#f4f7fb', borderRadius: '8px' }}>
                          <p><strong>Hint from student:</strong> Workplace supervisor name = "{p.workplace_supervisor_name || '—'}"</p>

                          <label>Workplace Supervisor: </label>
                          <select value={workplaceSupervisor} onChange={(e) => setWorkplaceSupervisor(e.target.value)}>
                            <option value="">-- None --</option>
                            {users.filter(u => u.role === 'workplace').map(u => (
                              <option key={u.id} value={u.id}>{u.username}</option>
                           ))}
                          </select>

                          <label style={{ marginLeft: '12px' }}>Academic Supervisor: </label>
                          <select value={academicSupervisor} onChange={(e) => setAcademicSupervisor(e.target.value)}>
                            <option value="">-- None --</option>
                            {users.filter(u => u.role === 'academic').map(u => (
                              <option key={u.id} value={u.id}>{u.username}</option>
                            ))}
                          </select>

                          <label style={{ marginLeft: '12px' }}>Status: </label>
                          <select value={placementStatus} onChange={(e) => setPlacementStatus(e.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                          </select>

                          <div style={{ marginTop: '10px' }}>
                            <button onClick={submitAssign}>Save</button>
                            <button onClick={cancelAssign} style={{ marginLeft: '8px' }}>Cancel</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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
                  <td>{i.reported_by_name || '—'}</td>
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
