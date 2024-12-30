import axios from "axios";

//BASEURL, HTTP 통신 프로토콜(application/json 등등..) 옵션 설정 추가
const API = axios.create({ baseURL: "http://localhost:3500/api" });

export const fetchProjects = async () => {
  try {
    const response = await API.get("/projects");
    return response.data;
  } catch (error) {
    console.error("Fetch projects error:", error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await API.post("/projects", projectData);
    return response.data;
  } catch (error) {
    console.error("Create project error:", error);
    throw error;
  }
};

export const fetchProjectById = async (projectId) => {
  try {
    const response = await API.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Fetch project by ID error:", error);
    throw error;
  }
};

export const updateProject = async (projectId, projectData) => {
  try {
    const response = await API.put(`/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    console.error("Update project error:", error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    const response = await API.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Delete project error:", error);
    throw error;
  }
};

export default API;
