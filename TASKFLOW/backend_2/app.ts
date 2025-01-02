import express from "express";
import signupRouter from "./routes/signup";

const app = express();
app.use(express.json());

// 회원가입 라우트 등록
app.use("/api/signup", signupRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
