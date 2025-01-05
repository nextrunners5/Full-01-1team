import axios from 'axios';

const API = axios.create({
  baseURL: 'http://test-mysql.c9aacka00jcg.ap-northeast-2.rds.amazonaws.com:3500/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 요청 인터셉터
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
API.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API; 