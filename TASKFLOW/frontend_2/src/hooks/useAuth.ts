import { useState } from "react";
import { authApi } from "../services/authApi";
import type { LoginCredentials, SignupData, LoginResponse } from "../services/authApi";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials);
      if (response.token) {
        setIsAuthenticated(true);
        return response.token;
      }
      throw new Error("토큰이 없습니다.");
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

  const handleLogout = () => {
    authApi.logout();
    setIsAuthenticated(false);
  };

  const checkAuth = () => {
    const isAuth = authApi.checkAuthToken();
    setIsAuthenticated(isAuth);
    return isAuth;
  };

  return { 
    isAuthenticated, 
    handleLogin, 
    handleSignup, 
    handleLogout,
    checkAuth 
  };
}; 