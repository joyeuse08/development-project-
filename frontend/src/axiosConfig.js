
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
});

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
export default api;
