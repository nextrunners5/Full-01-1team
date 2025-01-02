import { useState } from "react";
import { authApi, LoginCredentials, SignupData } from "../services/authApi";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials);
      const token = response.data.token;
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      return token;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleSignup = async (data: SignupData) => {
    try {
      await authApi.signup(data);
    } catch (error) {
      console.error("Signup error:", error);
      throw new Error("회원가입 중 오류가 발생했습니다.");
    }
  };

  return { isAuthenticated, handleLogin, handleSignup };
}; 