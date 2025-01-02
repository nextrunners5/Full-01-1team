import express from "express";
import { login, signup } from "../controllers/authController";

const router = express.Router();

router.post("/login", login); // 로그인 엔드포인트
router.post("/signup", signup); // 회원가입 엔드포인트

export default router; 