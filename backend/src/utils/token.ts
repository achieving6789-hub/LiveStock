import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { UserRole } from '../models/types.js';

export interface JwtPayload {
  userId: string;
  email: string;
  roles: UserRole[];
  permissions: string[];
}

export class TokenUtil {
  public static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });
  }

  public static generateRefreshToken(userId: string): string {
    return jwt.sign({ userId, type: 'refresh' }, env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });
  }

  public static verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
  }

  public static verifyRefreshToken(token: string): { userId: string; type: string } {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string; type: string };
  }
}
