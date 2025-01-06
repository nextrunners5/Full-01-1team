import express from 'express';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule, getScheduleById } from '../controllers/scheduleController';

const router = express.Router();

router.get('/schedules', getSchedules);
router.post('/schedules', createSchedule);
router.put('/schedules/:id', updateSchedule);
router.delete('/schedules/:id', deleteSchedule);
router.get('/schedules/:id', getScheduleById);

export default router; 