import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3500/api",
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

API.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    console.log('Received response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response || error);
    return Promise.reject(error);
  }
);

export default API; 