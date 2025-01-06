import { Router } from 'express';
import { login, signup, findEmail, resetPassword, verifyUserForReset } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
} from '../controllers/scheduleController';
import projectRoutes from './projectRoutes';
import bcrypt from 'bcrypt';
import pool from '../config/database';
import signupRouter from './signupRouter';
import checkEmailRouter from './checkEmail';
import { getUserInfo, updateUserInfo, deleteAccount } from '../controllers/userController';
import scheduleRoutes from './scheduleRoutes';

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
router.use('/schedules', scheduleRoutes);

// Project routes
router.use('/projects', projectRoutes);

export default router; 