import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  deleteMultipleProjects
} from '../controllers/projectController';

const router = Router();

router.get('/', authenticateToken, getAllProjects);
router.get('/:id', authenticateToken, getProjectById);
router.post('/', authenticateToken, createProject);
router.put('/:id', authenticateToken, updateProject);
router.delete('/:id', authenticateToken, deleteProject);
router.post('/delete-multiple', authenticateToken, deleteMultipleProjects);

export default router; 