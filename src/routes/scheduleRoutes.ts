import { Router, RequestHandler } from 'express';
import { createSchedule, getAllSchedules } from '../controllers/scheduleController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateToken as RequestHandler, createSchedule as RequestHandler);
router.get('/', authenticateToken as RequestHandler, getAllSchedules as RequestHandler);

export default router; 