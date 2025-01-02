import { useState } from "react";
import { login, signup } from "../services/authApi";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const handleSignup = async (email: string, password: string) => {
    try {
      await signup(email, password);
      await handleLogin(email, password);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return { isAuthenticated, handleLogin, handleSignup, handleLogout };
}; 