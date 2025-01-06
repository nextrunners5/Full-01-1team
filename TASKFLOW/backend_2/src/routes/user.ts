import express from 'express';
import { getUser, updateUser, deleteUser } from '../controllers/userController';

const router = express.Router();

router.get('/user', getUser);
router.put('/user', updateUser);
router.delete('/user', deleteUser);

export default router; 