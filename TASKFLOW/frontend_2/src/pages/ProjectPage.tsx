// ProjectContent.tsx
import React, { useEffect, useState } from "react";
import { fetchProjects, createProject, updateProject, deleteProject } from "../services/api";

const ProjectPage: React.FC = () => {
  const [projects, setProjects] = useState<{ id: number; name: string; description: string }[]>([]);
  const [newProject, setNewProject] = useState({ name: "", description: "", startDate: "", endDate: "" });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error loading projects:", error);
      }
    };

    loadProjects();
  }, []);

  const handleCreateProject = async () => {
    try {
      const createdProject = await createProject(newProject);
      setProjects([...projects, createdProject]);
      setNewProject({ name: "", description: "", startDate: "", endDate: "" });
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      await deleteProject(projectId);
      setProjects(projects.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div>
      <h1>Project Page</h1>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
        />
        <input
          type="date"
          value={newProject.startDate}
          onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
        />
        <input
          type="date"
          value={newProject.endDate}
          onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
        />
        <button onClick={handleCreateProject}>Create Project</button>
      </div>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            {project.name} - {project.description}
            <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectPage;
