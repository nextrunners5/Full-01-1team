import { Router } from 'express';
import { login, signup, findEmail, resetPassword } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
} from '../controllers/scheduleController';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  deleteMultipleProjects
} from '../controllers/projectController';
import bcrypt from 'bcrypt';
import pool from '../config/database';
import signupRouter from './signupRouter';
import checkEmailRouter from './checkEmail';

const router = Router();

// Auth routes
router.use('/signup', signupRouter);
router.use('/signup/check-email', checkEmailRouter);
router.post('/auth/login', login);
router.post('/auth/find-email', findEmail);
router.post('/auth/reset-password', resetPassword);

// Schedule routes
router.get('/schedules', authenticateToken, getAllSchedules);
router.post('/schedules', authenticateToken, createSchedule);
router.put('/schedules/:id', authenticateToken, updateSchedule);
router.delete('/schedules/:id', authenticateToken, deleteSchedule);

// Project routes
router.get('/projects', authenticateToken, getAllProjects);
router.get('/projects/:id', authenticateToken, getProjectById);
router.post('/projects', authenticateToken, createProject);
router.put('/projects/:id', authenticateToken, updateProject);
router.delete('/projects/:id', authenticateToken, deleteProject);
router.post('/projects/delete-multiple', authenticateToken, deleteMultipleProjects);

export default router; 