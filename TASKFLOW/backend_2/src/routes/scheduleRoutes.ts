import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
} from '../controllers/scheduleController';

const router = Router();

router.get('/', authenticateToken, getAllSchedules);
router.post('/', authenticateToken, createSchedule);
router.put('/:id', authenticateToken, updateSchedule);
router.delete('/:id', authenticateToken, deleteSchedule);

export default router; 