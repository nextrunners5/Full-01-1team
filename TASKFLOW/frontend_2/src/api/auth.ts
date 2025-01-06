import API, { tokenStorage } from './axiosConfig';

export const login = async (email: string, password: string) => {
  try {
    const response = await API.post('/login', { email, password });
    if (response.data.success) {
      // 브라우저/Node.js 환경에 따라 토큰 저장 방식 분리
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.data.token);
      } else {
        tokenStorage.setToken(response.data.data.token);
      }
      return response.data;
    }
    throw new Error(response.data.message);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const createProject = async (projectData: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}) => {
  try {
    const response = await API.post('/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('Create project error:', error);
    throw error;
  }
}; 