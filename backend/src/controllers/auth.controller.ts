import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository.js';
import { TokenUtil } from '../utils/token.js';
import { AppError } from '../middleware/errorHandler.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/auth.validator.js';
import { dbService } from '../config/db.js';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = registerSchema.parse(req.body);
      
      const existingUser = await UserRepository.findByEmail(validated.email);
      if (existingUser) {
        throw new AppError('An account with this email address already exists', 409, 'USER_ALREADY_EXISTS');
      }

      const user = await UserRepository.createUser({
        email: validated.email,
        password: validated.password,
        fullName: validated.fullName,
        phone: validated.phone,
        role: validated.role,
        preferredLanguage: validated.preferredLanguage,
        stateId: validated.stateId,
        districtId: validated.districtId,
        villageId: validated.villageId,
      });

      const accessToken = TokenUtil.generateAccessToken({
        userId: user.id,
        email: user.email,
        roles: user.roles,
        permissions: user.permissions,
      });

      const refreshToken = TokenUtil.generateRefreshToken(user.id);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      UserRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: UserRepository.toDTO(user),
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: '15m',
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = loginSchema.parse(req.body);

      const user = await UserRepository.findByEmail(validated.email);
      if (!user) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }

      if (!user.isActive) {
        throw new AppError('This user account has been deactivated', 403, 'ACCOUNT_DEACTIVATED');
      }

      const isPasswordValid = bcrypt.compareSync(validated.password, user.passwordHash);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }

      const accessToken = TokenUtil.generateAccessToken({
        userId: user.id,
        email: user.email,
        roles: user.roles,
        permissions: user.permissions,
      });

      const refreshToken = TokenUtil.generateRefreshToken(user.id);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      UserRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: UserRepository.toDTO(user),
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: '15m',
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = refreshTokenSchema.parse(req.body);

      let payload: { userId: string; type: string };
      try {
        payload = TokenUtil.verifyRefreshToken(validated.refreshToken);
      } catch {
        throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
      }

      const tokenEntry = UserRepository.getRefreshToken(validated.refreshToken);
      if (!tokenEntry || tokenEntry.revoked || new Date() > tokenEntry.expiresAt) {
        throw new AppError('Refresh token is revoked or expired', 401, 'REVOKED_REFRESH_TOKEN');
      }

      const user = await UserRepository.findById(payload.userId);
      if (!user || !user.isActive) {
        throw new AppError('User not found or inactive', 401, 'ACCOUNT_INACTIVE');
      }

      // Rotate Refresh Token
      UserRepository.revokeRefreshToken(validated.refreshToken);
      const newRefreshToken = TokenUtil.generateRefreshToken(user.id);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      UserRepository.saveRefreshToken(user.id, newRefreshToken, expiresAt);

      const newAccessToken = TokenUtil.generateAccessToken({
        userId: user.id,
        email: user.email,
        roles: user.roles,
        permissions: user.permissions,
      });

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn: '15m',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        UserRepository.revokeRefreshToken(refreshToken);
      }

      res.status(200).json({
        success: true,
        message: 'Successfully logged out',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      }

      const user = await UserRepository.findById(req.user.id);
      if (!user) {
        throw new AppError('User not found', 404, 'NOT_FOUND');
      }

      res.status(200).json({
        success: true,
        data: {
          user: UserRepository.toDTO(user),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAllUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = UserRepository.getAllUsers();
      res.status(200).json({
        success: true,
        data: { users },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAuditLogs(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: {
          auditLogs: dbService.auditLogs.slice(0, 50),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
