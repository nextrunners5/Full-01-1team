// src/types/express.d.ts
import { Request, Response } from 'express';
import { JwtPayloadUser } from '../middlewares/authMiddleware';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadUser;
    }
  }
}

export { Request, Response };
