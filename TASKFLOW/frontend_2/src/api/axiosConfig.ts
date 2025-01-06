import axios from 'axios';

// 테스트 환경에서 사용할 토큰 저장소
const tokenStorage = {
  token: '',
  setToken(value: string) {
    this.token = value;
  },
  getToken() {
    return this.token;
  }
};

const API = axios.create({
  baseURL: 'http://54.180.245.123:3500/api',
  withCredentials: true
});

// 요청 인터셉터 - 토큰 추가
API.interceptors.request.use(
  (config) => {
    // Node.js 환경인 경우 tokenStorage 사용, 브라우저 환경인 경우 localStorage 사용
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('token')
      : tokenStorage.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { tokenStorage };  // tokenStorage 내보내기
export default API; 