import express from 'express';
import { getUserInfo } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/:id', authenticateToken, getUserInfo);

export default router; 