import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

const ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'workplace', label: 'Workplace Supervisor' },
  { value: 'academic', label: 'Academic Supervisor' },
];

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    role: '',
    department: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.role) {
      setError('Please select a role');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/users/', form);
      navigate('/login');
    } catch (err) {
      const detail = err.response?.data?.username?.[0] || 'Registration failed. Username might already exist.';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create Account</h2>
        {error && <div className="message error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input name="first_name" type="text" placeholder="First Name" value={form.first_name} onChange={handleChange} required />
          <input name="last_name" type="text" placeholder="Last Name" value={form.last_name} onChange={handleChange} required />
          <input name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="department" type="text" placeholder="Department" value={form.department} onChange={handleChange} required />
          <select name="role" value={form.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="switch-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
