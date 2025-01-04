import API from '../api/axiosConfig';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  birthdate: string;
  gender: string;
  idNumber?: string;
}

interface IAuthApi {
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  checkAuthToken: () => boolean;
}

export const authApi: IAuthApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await API.post<LoginResponse>("/auth/login", credentials);
      const loginData = response.data;
      
      if (loginData.token) {
        localStorage.setItem('token', loginData.token);
        localStorage.setItem('user', JSON.stringify(loginData.user));
        API.defaults.headers.common['Authorization'] = `Bearer ${loginData.token}`;
      }
      
      return loginData;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.error || "로그인 중 오류가 발생했습니다.");
      }
      throw new Error("서버와 통신 중 오류가 발생했습니다.");
    }
  },

  signup: async (data: SignupData): Promise<void> => {
    try {
      await API.post("/auth/signup", data);
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.error || "회원가입 중 오류가 발생했습니다.");
      }
      throw new Error("서버와 통신 중 오류가 발생했습니다.");
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
  }
};

export type {
  LoginResponse,
  LoginCredentials,
  SignupData,
  IAuthApi
}; 