import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayloadUser {
  id: number;
  email: string;
  name: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "토큰이 필요합니다." });

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
    if (err) return res.status(403).json({ error: "유효하지 않은 토큰입니다." });
    
    req.user = decoded as JwtPayloadUser;
    next();
  });
}; 