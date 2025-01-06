import { Request, Response, NextFunction } from "express";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  // 요청 유효성 검사 로직
  next();
}; 