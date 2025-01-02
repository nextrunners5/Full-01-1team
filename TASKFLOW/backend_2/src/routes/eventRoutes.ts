import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router; 