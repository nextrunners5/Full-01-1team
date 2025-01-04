import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController';

const router = Router();

router.get('/', authenticateToken, getAllEvents);
router.get('/:id', authenticateToken, getEventById);
router.post('/', authenticateToken, createEvent);
router.put('/:id', authenticateToken, updateEvent);
router.delete('/:id', authenticateToken, deleteEvent);

export default router; 