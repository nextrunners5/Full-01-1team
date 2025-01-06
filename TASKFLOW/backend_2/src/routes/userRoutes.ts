import express from 'express';
import { getUserInfo, updateUser, deleteUser } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/user', authenticateToken, getUserInfo as any);
router.put('/user', authenticateToken, updateUser as any);
router.delete('/user', authenticateToken, deleteUser as any);

export default router; 