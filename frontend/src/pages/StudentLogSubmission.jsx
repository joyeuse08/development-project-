import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const LogSubmission = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    hours: '',
    challenges: '',
  });
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Single handler updates all form fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle file attachment separately
  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  // Frontend validation
  const validate = () => {
    if (!formData.date) {
      setError('Date is required');
      return false;
    }
    if (!formData.description) {
      setError('Description is required');
      return false;
    }
    if (!formData.hours || formData.hours <= 0) {
      setError('Hours must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check frontend validation first
    if (!validate()) return;

    setLoading(true);

    try {
      // Use FormData to handle file upload
      const data = new FormData();
      data.append('date', formData.date);
      data.append('description', formData.description);
      data.append('hours', formData.hours);
      data.append('challenges', formData.challenges);
      data.append('status', 'draft');
      if (attachment) {
        data.append('attachment', attachment);
      }

      await axios.post('/api/Student_log/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setSuccess('Log submitted successfully!');
      // Reset form
      setFormData({
        date: '',
        description: '',
        hours: '',
        challenges: '',
      });
      setAttachment(null);

      // Go back to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/student_dashboard');
      }, 2000);

    } catch (error) {
      setError(
        error.response?.data?.hours?.[0] ||
        error.response?.data?.description?.[0] ||
        error.response?.data?.date?.[0] ||
        JSON.stringify(error.response?.data) ||
        'Failed to submit log. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Submit Daily Log</h1>
        <div>
          <button onClick={() => navigate('/student_dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>New Log Entry</h2>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <form onSubmit={handleSubmit}>

            {/* Date */}
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                className="form-input"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Description * (What did you do today?)
              </label>
              <textarea
                className="form-input"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe what you worked on today..."
                required
              />
            </div>

            {/* Hours */}
            <div className="form-group">
              <label className="form-label">Hours Spent *</label>
              <input
                className="form-input"
                type="number"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                min="1"
                max="24"
                placeholder="Enter number of hours"
                required
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
                placeholder="Any challenges you faced today..."
              />
            </div>

            {/* Attachment */}
            <div className="form-group">
              <label className="form-label">
                Attachment (Optional)
              </label>
              <input
                className="form-input"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <small style={{color: '#666', fontSize: '12px'}}>
                Accepted: PDF, Word, Images
              </small>
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
                {loading ? 'Submitting...' : 'Submit Log'}
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

export default LogSubmission;