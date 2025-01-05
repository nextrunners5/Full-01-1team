import API from '../api/axiosConfig';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  birthdate: string;
  gender: string;
  idNumber?: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: number;
      email: string;
      name: string;
    }
  };
  message?: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await API.post<LoginResponse>('/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { token, user };
      }
      throw new Error(response.data.message || '로그인에 실패했습니다.');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('로그인 중 오류가 발생했습니다.');
    }
  },

  signup: async (data: SignupData): Promise<SignupResponse> => {
    try {
      const response = await API.post<SignupResponse>('/signup', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('회원가입 중 오류가 발생했습니다.');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete API.defaults.headers.common['Authorization'];
  },

  checkAuthToken: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  checkEmail: async (email: string): Promise<{ message: string }> => {
    try {
      const response = await API.post<{ message: string }>('/signup/check-email', { email });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('이메일 중복 확인 중 오류가 발생했습니다.');
    }
  },

  resetPassword: async (email: string, name: string, newPassword: string) => {
    try {
      const response = await API.post('/auth/reset-password', {
        email,
        name,
        newPassword
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('비밀번호 재설정 중 오류가 발생했습니다.');
    }
  }
}; 