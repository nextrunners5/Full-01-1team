import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController';

const router = Router();

router.get('/', authenticateToken, getAllProjects);
router.get('/:id', authenticateToken, getProjectById);
router.post('/', authenticateToken, createProject);
router.put('/:id', authenticateToken, updateProject);
router.delete('/:id', authenticateToken, deleteProject);

export default router; 