import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "토큰이 필요합니다." });

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) return res.status(403).json({ error: "유효하지 않은 토큰입니다." });
    req.user = user;
    next();
  });
}; 