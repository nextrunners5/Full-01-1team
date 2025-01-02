import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3500/api" });

export const login = async (email: string, password: string): Promise<string> => {
  try {
    const response = await API.post("/auth/login", { email, password });
    return response.data.token;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("로그인 중 오류가 발생했습니다.");
  }
};

export const signup = async (email: string, password: string): Promise<void> => {
  try {
    await API.post("/auth/signup", { email, password });
  } catch (error) {
    console.error("Signup error:", error);
    throw new Error("회원가입 중 오류가 발생했습니다.");
  }
}; 