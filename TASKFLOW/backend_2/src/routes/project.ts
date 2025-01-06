import express from 'express';
import { getAllProjects, createProject, updateProject, deleteProject, getProjectById } from '../controllers/projectController';

const router = express.Router();

router.get('/projects', getAllProjects);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);
router.get('/projects/:id', getProjectById);

export default router; 