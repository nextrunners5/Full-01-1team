const express = require("express");
const { login, signup } = require("../controllers/authController");
const router = express.Router();

router.post("/login", login); // 로그인 엔드포인트
router.post("/signup", signup); // 회원가입 엔드포인트

module.exports = router;
