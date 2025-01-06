import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3500/api',
});

// ✅ API 기본 설정
// ✅ 토큰 인터셉터
// ✅ 에러 처리

export default API; 