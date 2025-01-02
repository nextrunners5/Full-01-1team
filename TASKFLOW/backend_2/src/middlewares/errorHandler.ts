import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "서버 오류가 발생했습니다." });
}; 