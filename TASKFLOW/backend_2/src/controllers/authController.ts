import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";
import { responseHandler } from "../utils/responseHandler";
import { logger } from "../utils/logger";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name, birthdate, gender, idNumber } = req.body;

    // 입력값 검증
    if (!email || !password || !name || !birthdate || !gender) {
      return responseHandler.error(res, 400, "필수 항목이 누락되었습니다.");
    }

    // 이메일 중복 확인
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return responseHandler.error(res, 400, "이미 사용 중인 이메일입니다.");
    }

    // 사용자 생성
    const user = await UserModel.create({
      email,
      password,
      name,
      birthdate,
      gender,
      id_number: idNumber
    });

    logger.info('회원가입 성공:', { email, name });
    responseHandler.success(res, 201, { message: "회원가입이 완료되었습니다." });
  } catch (error) {
    logger.error('회원가입 중 오류 발생:', error);
    responseHandler.error(res, 500, "서버 오류가 발생했습니다.");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt with:', { email, password });

    const user = await UserModel.findOne({
      where: { email }
    });

    console.log('Found user:', user);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "이메일 또는 비밀번호가 잘못되었습니다."
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password validation:', { isValid });

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "이메일 또는 비밀번호가 잘못되었습니다."
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다."
    });
  }
}; 