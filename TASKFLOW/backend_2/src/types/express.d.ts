// src/types/express.d.ts
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any; // 실제로는 User와 같은 구체적인 타입을 지정하는 것이 좋습니다.
    }
  }
}
