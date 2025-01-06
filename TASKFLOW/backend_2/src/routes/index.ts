import { Router } from 'express';
import { login, signup, findEmail, resetPassword, verifyUserForReset } from '../controllers/authController';
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
import { getUserInfo, updateUserInfo, deleteAccount } from '../controllers/userController';

const router = Router();

// User routes - 최상단에 배치
router.get('/users/me', authenticateToken, getUserInfo);
router.put('/users/me', authenticateToken, updateUserInfo);
router.delete('/users/me', authenticateToken, deleteAccount);

// Auth routes
router.use('/signup', signupRouter);
router.use('/signup/check-email', checkEmailRouter);
router.post('/auth/login', login);
router.post('/auth/find-email', findEmail);
router.post('/auth/reset-password', resetPassword);
router.post('/auth/verify-reset', verifyUserForReset);

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