import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '', role: 'student', department: '', student_number: '', staff_number: ''
});
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
    const response = await axios.post(
"http://127.0.0.1:8000/api/register/",
          {
            username,
            email,
            password,
            role,
          }
    );
  
    if (response.data){
     alert("Registered successfully");
     navigate('/login');
    } 
  } catch (error) {
    setError(
      error.response?.data?.message ||
      JSON.stringify(error.response?.data) ||
      'Registration failed. Please try again.'
    );
  }
};

   const set = (field) => (e) =>
  setFormData((prev) => ({ ...prev, [field]: e.target.value }));

return (
  <div className="auth-wrapper">
    <div className="auth-card auth-card-wide">
      <div className="auth-logo">📋</div>
      <h2 className="auth-heading">Create Account</h2>
      <p className="auth-subheading">Join the internship management portal</p>
      {error && <p className="auth-error">{error}</p>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" type="text" placeholder="Choose a username"
              value={formData.username} onChange={set('username')} required />
            {fieldErrors.username && <span className="field-error">{fieldErrors.username[0]}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="your@email.com"
              value={formData.email} onChange={set('email')} required />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email[0]}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Role</label>
          <select className="form-select" value={formData.role} onChange={set('role')}>
            <option value="student">Student</option>
            <option value="academic_supervisor">Academic Supervisor</option>
            <option value="workplace_supervisor">Workplace Supervisor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {formData.role === 'student' && (
          <div className="form-group">
            <label className="form-label">Student Number</label>
            <input className="form-input" type="text" placeholder="e.g. 2100700123"
              value={formData.student_number} onChange={set('student_number')} />
          </div>
        )}

        {(formData.role === 'academic_supervisor' || formData.role === 'workplace_supervisor') && (
          <div className="form-group">
            <label className="form-label">Staff Number</label>
            <input className="form-input" type="text" placeholder="e.g. STAFF001"
              value={formData.staff_number} onChange={set('staff_number')} />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Department</label>
          <input className="form-input" type="text" placeholder="e.g. Computer Science"
            value={formData.department} onChange={set('department')} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-toggle">
              <input className="form-input" type={showPassword ? 'text' : 'password'}
                placeholder="Create a password" value={formData.password}
                onChange={set('password')} required />
              <button type="button" className="toggle-password"
                onClick={() => setShowPassword((s) => !s)}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {fieldErrors.password && <span className="field-error">{fieldErrors.password[0]}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type={showPassword ? 'text' : 'password'}
              placeholder="Repeat your password" value={formData.confirmPassword}
              onChange={set('confirmPassword')} required />
          </div>
        </div>

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>
      <p className="auth-footer">
        Already have an account? <Link className="auth-link" to="/login">Sign In</Link>
      </p>
    </div>
  </div>
); 
};

export default Register;
