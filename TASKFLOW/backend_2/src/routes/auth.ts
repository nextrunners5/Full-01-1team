import express from 'express';
import { signup, login, findEmail, resetPassword, verifyUserForReset } from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/find-email', findEmail);
router.post('/reset-password', resetPassword);
router.post('/verify-user', verifyUserForReset);

export default router; 