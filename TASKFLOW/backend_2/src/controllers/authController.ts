import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sequelize from "../config/db";
import { QueryTypes } from "sequelize";

// 회원가입
export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const [existingUser] = await sequelize.query<any>(
      "SELECT * FROM users WHERE email = ?",
      { replacements: [email], type: QueryTypes.SELECT }
    );
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sequelize.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      { replacements: [email, hashedPassword], type: QueryTypes.INSERT }
    );

    res.status(201).json({ message: "회원가입 성공!" });
  } catch (error) {
    console.error("회원가입 중 오류 발생:", (error as Error).message);
    res.status(500).json({ error: "서버 오류" });
  }
};

// 로그인
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const [user] = await sequelize.query<any>(
      "SELECT * FROM users WHERE email = ?",
      { replacements: [email], type: QueryTypes.SELECT }
    );

    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h"
    });

    res.json({ token });
  } catch (error) {
    console.error("로그인 중 오류 발생:", (error as Error).message);
    res.status(500).json({ error: "서버 오류" });
  }
}; 