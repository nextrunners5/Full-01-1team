import { Request, Response } from "express";
import pool from '../config/database';
import bcrypt from 'bcrypt';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import crypto from 'crypto';

// 주민번호 복호화 함수
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

// 사용자 정보 조회
const getUserInfo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    console.log('Fetching user info for id:', req.user.id);

    // 유효하지 않은 날짜 처리를 위해 CASE WHEN 사용
    const [rows] = await pool.query(
      `SELECT 
        id, 
        email, 
        name, 
        CASE 
          WHEN birthdate = '0000-00-00' THEN NULL
          ELSE DATE_FORMAT(birthdate, '%Y-%m-%d')
        END as birthdate, 
        IFNULL(gender, '') as gender 
      FROM users 
      WHERE id = ?`,
      [req.user.id]
    );

    console.log('Query result:', rows);

    const user = (rows as any[])[0];
    
    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    // 응답 데이터 구조화
    const formattedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      birthdate: user.birthdate || null,
      gender: user.gender || null
    };

    console.log('Sending formatted user:', formattedUser);
    res.json(formattedUser);
  } catch (error) {
    console.error("사용자 정보 조회 중 상세 오류:", error);
    res.status(500).json({ 
      error: "서버 오류가 발생했습니다.",
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

// 사용자 정보 수정
const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    const { name, currentPassword, newPassword, idNumber } = req.body;

    console.log('Update request for user:', req.user.id);

    // 현재 사용자 정보 조회 쿼리 수정
    const [userRows] = await pool.query(
      `SELECT 
        id, 
        email, 
        name, 
        password,
        IFNULL(DATE_FORMAT(birthdate, '%Y-%m-%d'), '') as birthdate, 
        IFNULL(gender, '') as gender,
        id_number 
      FROM users 
      WHERE id = ?`,
      [req.user.id]
    );

    const user = (userRows as any[])[0];

    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    // 비밀번호 변경이 포함된 경우
    if (newPassword) {
      if (!currentPassword || !idNumber) {
        return res.status(400).json({ error: "현재 비밀번호와 주민등록번호를 입력해주세요." });
      }

      // 주민등록번호 확인
      try {
        if (!user.id_number) {
          return res.status(400).json({ error: "저장된 주민등록번호가 없습니다." });
        }

        const decryptedIdNumber = decryptIdNumber(user.id_number);
        console.log('Comparing ID numbers:', {
          provided: idNumber,
          stored: user.id_number
        });

        if (decryptedIdNumber !== idNumber) {
          return res.status(401).json({ error: "주민등록번호가 일치하지 않습니다." });
        }
      } catch (error) {
        console.error('주민등록번호 복호화 중 오류:', error);
        return res.status(500).json({ error: "주민등록번호 확인 중 오류가 발생했습니다." });
      }

      // 현재 비밀번호 확인
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "현재 비밀번호가 일치하지 않습니다." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      await pool.query(
        'UPDATE users SET name = ?, password = ? WHERE id = ?',
        [name, hashedNewPassword, req.user.id]
      );
    } else {
      await pool.query(
        'UPDATE users SET name = ? WHERE id = ?',
        [name, req.user.id]
      );
    }

    // 업데이트된 정보 조회
    const [updatedRows] = await pool.query(
      `SELECT 
        id, 
        email, 
        name, 
        DATE_FORMAT(birthdate, '%Y-%m-%d') as birthdate, 
        IFNULL(gender, '') as gender 
      FROM users 
      WHERE id = ?`,
      [req.user.id]
    );

    const updatedUser = (updatedRows as any[])[0];

    res.json({
      message: "사용자 정보가 성공적으로 수정되었습니다.",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        birthdate: updatedUser.birthdate || null,
        gender: updatedUser.gender || null
      }
    });
  } catch (error) {
    console.error("사용자 정보 수정 중 상세 오류:", error);
    res.status(500).json({
      error: "서버 오류가 발생했습니다.",
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

// 회원 탈퇴
const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  const { password, idNumber } = req.body;
  const userId = req.user?.id;

  try {
    // 1. 사용자 정보 조회
    const [user] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (!(user as any[])[0]) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    const currentUser = (user as any[])[0];

    // 2. 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, currentUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: '비밀번호가 일치하지 않습니다.'
      });
    }

    // 3. 주민번호 확인 - 복호화 로직 추가
    try {
      const decryptedIdNumber = decryptIdNumber(currentUser.id_number);
      if (decryptedIdNumber !== idNumber) {
        return res.status(401).json({
          success: false,
          error: '주민등록번호가 일치하지 않습니다.'
        });
      }
    } catch (error) {
      console.error('주민등록번호 복호화 중 오류:', error);
      return res.status(500).json({
        success: false,
        message: '주민등록번호 확인 중 오류가 발생했습니다.'
      });
    }

    // 4. 회원 삭제
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: '회원 탈퇴가 완료되었습니다.'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
};

// 하나의 export로 통합
export {
  getUserInfo,
  updateUser,
  deleteUser
}; 