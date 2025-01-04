import type { Response } from 'express';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export const responseHandler = {
  success: (res: Response, statusCode: number, data: any): void => {
    const response: ApiResponse = {
      success: true,
      data
    };
    res.status(statusCode).json(response);
  },
  error: (res: Response, statusCode: number, message: string): void => {
    const response: ApiResponse = {
      success: false,
      error: message
    };
    res.status(statusCode).json(response);
  }
}; 