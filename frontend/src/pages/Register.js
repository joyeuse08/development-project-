import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('student');
  const [studentNumber, setStudentNumber] = useState('');
  const [staffNumber, setStaffNumber] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(username, email, password, department, role, studentNumber, staffNumber);
    if (success) {
      navigate('/login');
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="workplace">Workplace Supervisor</option>
        <option value="academic">Academic Supervisor</option>
        <option value="admin">Administrator</option>
      </select>
      {role === 'student' && (
        <input
          type="text"
          placeholder="Student Number"
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value)}
        />
      )}
      {role !== 'student' && (
        <input
          type="text"
          placeholder="Staff Number"
          value={staffNumber}
          onChange={(e) => setStaffNumber(e.target.value)}
        />
      )}
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
