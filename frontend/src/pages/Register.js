import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    role: 'student',
    student_number: '',
    staff_number: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match.' });
      return;
    }

    const result = await register(
      formData.username,
      formData.email,
      formData.password,
      formData.department,
      formData.role,
      formData.student_number,
      formData.staff_number,
    );

    if (result.success) {
      navigate('/login');
    } else {
      const errs = result.errors || {};
      if (typeof errs === 'string') {
        setError(errs);
      } else {
        setFieldErrors(errs);
        setError('Please correct the errors below.');
      }
    }
  };

  const isStudent = formData.role === 'student';
  const isStaff = ['workplace', 'academic', 'admin'].includes(formData.role);

  return (
    <div className="auth-wrapper">
      <div className="auth-card auth-card-wide">
        {/* Brand */}
        <div className="auth-logo">
          <div className="auth-logo-icon">📋</div>
          <h1 className="auth-logo-title">ILES</h1>
          <p className="auth-logo-subtitle">Internship Log & Evaluation System</p>
        </div>

        <h2 className="auth-heading">Create Account</h2>
        <p className="auth-subheading">Join the internship management platform</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Row 1: Username + Email */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-username">Username *</label>
              <input
                id="reg-username"
                className={`form-input${fieldErrors.username ? ' input-error' : ''}`}
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
              {fieldErrors.username && (
                <span className="field-error">{fieldErrors.username}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email *</label>
              <input
                id="reg-email"
                className={`form-input${fieldErrors.email ? ' input-error' : ''}`}
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
              {fieldErrors.email && (
                <span className="field-error">{fieldErrors.email}</span>
              )}
            </div>
          </div>

          {/* Row 2: Password + Confirm */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password *</label>
              <div className="input-with-toggle">
                <input
                  id="reg-password"
                  className={`form-input${fieldErrors.password ? ' input-error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {fieldErrors.password && (
                <span className="field-error">{fieldErrors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password *</label>
              <input
                id="reg-confirm"
                className={`form-input${fieldErrors.confirmPassword ? ' input-error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              {fieldErrors.confirmPassword && (
                <span className="field-error">{fieldErrors.confirmPassword}</span>
              )}
            </div>
          </div>

          {/* Row 3: Role + Department */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-role">Role *</label>
              <select
                id="reg-role"
                className="form-input form-select"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="student">Student</option>
                <option value="workplace">Workplace Supervisor</option>
                <option value="academic">Academic Supervisor</option>
                <option value="admin">Internship Administrator</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-department">Department</label>
              <input
                id="reg-department"
                className="form-input"
                type="text"
                name="department"
                placeholder="e.g. Computer Science"
                value={formData.department}
                onChange={handleChange}
                autoComplete="organization"
              />
            </div>
          </div>

          {/* Student number — shown only for students */}
          {isStudent && (
            <div className="form-group">
              <label className="form-label" htmlFor="reg-student-number">Student Number</label>
              <input
                id="reg-student-number"
                className={`form-input${fieldErrors.student_number ? ' input-error' : ''}`}
                type="text"
                name="student_number"
                placeholder="e.g. STU2024001"
                value={formData.student_number}
                onChange={handleChange}
              />
              {fieldErrors.student_number && (
                <span className="field-error">{fieldErrors.student_number}</span>
              )}
            </div>
          )}

          {/* Staff number — shown for supervisors and admins */}
          {isStaff && (
            <div className="form-group">
              <label className="form-label" htmlFor="reg-staff-number">Staff Number</label>
              <input
                id="reg-staff-number"
                className={`form-input${fieldErrors.staff_number ? ' input-error' : ''}`}
                type="text"
                name="staff_number"
                placeholder="e.g. STF001"
                value={formData.staff_number}
                onChange={handleChange}
              />
              {fieldErrors.staff_number && (
                <span className="field-error">{fieldErrors.staff_number}</span>
              )}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
