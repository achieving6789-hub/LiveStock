import type { Request, Response, NextFunction } from 'express';
import { TokenUtil, type JwtPayload } from '../utils/token.js';
import { AppError } from './errorHandler.js';
import { UserRepository } from '../repositories/user.repository.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string };
    }
  }
}

export const authenticateJwt = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication token missing or invalid format', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('Authentication token missing', 401, 'UNAUTHORIZED');
    }

    try {
      const payload = TokenUtil.verifyAccessToken(token);
      
      // Verify user is still active in database
      const user = await UserRepository.findById(payload.userId);
      if (!user || !user.isActive) {
        throw new AppError('User account not found or deactivated', 401, 'ACCOUNT_INACTIVE');
      }

      req.user = {
        ...payload,
        id: payload.userId,
      };

      next();
    } catch (jwtErr: any) {
      if (jwtErr instanceof AppError) throw jwtErr;
      if (jwtErr?.name === 'TokenExpiredError') {
        throw new AppError('Access token has expired', 401, 'TOKEN_EXPIRED');
      }
      throw new AppError('Invalid or corrupted authentication token', 401, 'INVALID_TOKEN');
    }
  } catch (error) {
    next(error);
  }
};
