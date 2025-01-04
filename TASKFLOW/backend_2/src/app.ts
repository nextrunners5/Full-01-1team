import dotenv from 'dotenv';
import express, { Router } from "express";
import cors from "cors";
import { connectDB } from "./config/database";

// 라우터 import
import authRoutes from "./routes/authRoutes";
import signupRouter from "./routes/signupRouter";
import checkEmailRouter from "./routes/checkEmail";
import scheduleRoutes from "./routes/scheduleRoutes";
import projectRoutes from "./routes/projectRoutes";
import eventRoutes from "./routes/eventRoutes";

dotenv.config();

const app = express();

// 미들웨어 설정
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// 라이터베이스 연결
connectDB();

// 라우터 타입 체크
const isRouter = (router: any): router is Router => {
  return router && typeof router.use === 'function';
};

// 라우터 설정
if (isRouter(authRoutes)) app.use("/api/auth", authRoutes);
if (isRouter(signupRouter)) app.use("/api/signup", signupRouter);
if (isRouter(checkEmailRouter)) app.use("/api/check-email", checkEmailRouter);
if (isRouter(scheduleRoutes)) app.use("/api/schedules", scheduleRoutes);
if (isRouter(projectRoutes)) app.use("/api/projects", projectRoutes);
if (isRouter(eventRoutes)) app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
