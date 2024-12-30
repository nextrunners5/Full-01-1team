import axios, { AxiosResponse } from "axios";

const API = axios.create({ baseURL: "http://localhost:3500/api" });

export const fetchProjects = async (): Promise<any[]> => {
  try {
    const response: AxiosResponse<any[]> = await API.get("/projects");
    return response.data;
  } catch (error) {
    console.error("Fetch projects error:", error);
    throw error;
  }
};

export const createProject = async (projectData: any): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await API.post("/projects", projectData);
    return response.data;
  } catch (error) {
    console.error("Create project error:", error);
    throw error;
  }
};

export const fetchProjectById = async (projectId: number): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await API.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Fetch project by ID error:", error);
    throw error;
  }
};

export const updateProject = async (projectId: number, projectData: any): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await API.put(`/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    console.error("Update project error:", error);
    throw error;
  }
};

export const deleteProject = async (projectId: number): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await API.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Delete project error:", error);
    throw error;
  }
};

export default API; 