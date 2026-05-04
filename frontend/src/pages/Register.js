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
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const result = await register(username, email, password, department, role);
  if (result.success) {
    navigate('/login');
  } else {
    setError(JSON.stringify(result.errors));
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
   const success = await register(username, email, password, department, role);
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
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
