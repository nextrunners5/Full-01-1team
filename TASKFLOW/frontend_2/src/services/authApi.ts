import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3500/api" });

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  name: string;
  birthdate: string;
  gender: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) => 
    API.post('/auth/login', credentials),
  
  signup: (data: SignupData) => 
    API.post('/auth/signup', data),
  
  logout: () => 
    API.post('/auth/logout'),
  
  checkAuth: () => 
    API.get('/auth/check')
}; 