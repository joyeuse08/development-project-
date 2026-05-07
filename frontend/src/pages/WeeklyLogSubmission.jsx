import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const WeeklyLogSubmission = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    week_number: '',
    activities: '',
    challenges: '',
    learnings: '',
    status: 'draft',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    if (!formData.week_number || formData.week_number <= 0) {
      setError('Week number must be greater than 0');
      return false;
    }
    if (!formData.activities) {
      setError('Activities field is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validate()) return;

    setLoading(true);

    try {
      await axios.post('/api/Weekly_Log/', formData);

      setSuccess('Weekly log submitted successfully!');
      setFormData({
        week_number: '',
        activities: '',
        challenges: '',
        learnings: '',
        status: 'draft',
      });

      setTimeout(() => {
        navigate('/student_dashboard');
      }, 2000);

    } catch (error) {
      setError(
        error.response?.data?.week_number?.[0] ||
        error.response?.data?.activities?.[0] ||
        JSON.stringify(error.response?.data) ||
        'Failed to submit weekly log.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Submit Weekly Log</h1>
        <div>
          <button onClick={() => navigate('/student_dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Weekly Summary</h2>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <form onSubmit={handleSubmit}>

            {/* Week Number */}
            <div className="form-group">
              <label className="form-label">Week Number *</label>
              <input
                className="form-input"
                type="number"
                name="week_number"
                value={formData.week_number}
                onChange={handleChange}
                min="1"
                max="52"
                placeholder="e.g. 1, 2, 3..."
                required
              />
            </div>

            {/* Activities */}
            <div className="form-group">
              <label className="form-label">
                Activities * (What did you do this week?)
              </label>
              <textarea
                className="form-input"
                name="activities"
                value={formData.activities}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your activities this week..."
                required
              />
            </div>

            {/* Learnings */}
            <div className="form-group">
              <label className="form-label">
                Learnings (What did you learn?)
              </label>
              <textarea
                className="form-input"
                name="learnings"
                value={formData.learnings}
                onChange={handleChange}
                rows="3"
                placeholder="What new things did you learn this week..."
              />
            </div>

            {/* Challenges */}
            <div className="form-group">
              <label className="form-label">
                Challenges (Optional)
              </label>
              <textarea
                className="form-input"
                name="challenges"
                value={formData.challenges}
                onChange={handleChange}
                rows="3"
                placeholder="Any challenges you faced this week..."
              />
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Save as Draft</option>
                <option value="submitted">Submit for Review</option>
              </select>
            </div>

            {/* Buttons */}
            <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #1e3a5f, #008080)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Submitting...' : 'Submit Weekly Log'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/student_dashboard')}
                style={{
                  background: 'transparent',
                  color: '#1e3a5f',
                  border: '2px solid #1e3a5f',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default WeeklyLogSubmission;