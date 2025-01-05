import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";
import { responseHandler } from "../utils/responseHandler";
import { logger } from "../utils/logger";
import bcrypt from "bcrypt";
import pool from '../config/database';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// 주민번호 암호화 함수 수정
const encryptIdNumber = (idNumber: string): string => {
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'your-secret-key', 'salt', 32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(idNumber, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const result = `${iv.toString('hex')}:${encrypted}`;
    console.log('Encryption result:', {
      original: idNumber,
      encrypted: result
    });
    return result;
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

// 주민번호 복호화 함수 추가
const decryptIdNumber = (encrypted: string): string => {
  try {
    const [ivHex, encryptedText] = encrypted.split(':');
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'your-secret-key', 'salt', 32);
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};

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

    // 사용자 조회
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    const user = (rows as any[])[0];

    console.log('Found user:', user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "이메일 또는 비밀번호가 잘못되었습니다."
      });
    }

    // 비밀번호 검증
    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password validation:', { isValid });

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "이메일 또는 비밀번호가 잘못되었습니다."
      });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // 성공 응답
    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      },
      message: "로그인에 성공했습니다."
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다."
    });
  }
};

export const findEmail = async (req: Request, res: Response) => {
  const { name, birthNumber } = req.body;
  
  try {
    // 주민번호 암호화
    const encryptedBirthNumber = encryptIdNumber(birthNumber);
    
    console.log('Search parameters:', { 
      name, 
      birthNumber,
      encryptedBirthNumber
    });

    // 먼저 이름으로만 검색
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE name = ?',
      [name]
    );

    console.log('Found users by name:', rows);

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ 
        success: false,
        message: '일치하는 사용자 정보를 찾을 수 없습니다.' 
      });
    }

    // 주민번호 확인
    const user = (rows as any[]).find(user => {
      try {
        const decryptedIdNumber = decryptIdNumber(user.id_number);
        return decryptedIdNumber === birthNumber;
      } catch (error) {
        console.error('Error comparing id_number:', error);
        return false;
      }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: '일치하는 사용자 정보를 찾을 수 없습니다.' 
      });
    }

    res.json({ 
      success: true,
      email: user.email,
      message: '이메일을 찾았습니다.' 
    });
  } catch (error) {
    console.error('Find email error:', error);
    res.status(500).json({ 
      success: false,
      message: '서버 오류가 발생했습니다.' 
    });
  }
}; 