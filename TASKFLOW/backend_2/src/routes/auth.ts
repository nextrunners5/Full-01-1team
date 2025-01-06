import express from 'express';
import { 
  login, 
  signup, 
  findEmail, 
  resetPassword, 
  verifyUserForReset 
} from '../controllers/authController';

const router = express.Router();

// 인증 관련 라우트
router.post('/login', login);
router.post('/signup', signup);
router.post('/find-email', findEmail);
router.post('/reset-password', resetPassword);
router.post('/verify-reset', verifyUserForReset);

export default router; 