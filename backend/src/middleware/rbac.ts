import type { Request, Response, NextFunction } from 'express';
import type { UserRole } from '../models/types.js';
import { AppError } from './errorHandler.js';

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required before checking roles', 401, 'UNAUTHORIZED'));
      return;
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      next(
        new AppError(
          `Access forbidden: required role [${allowedRoles.join(', ')}], current roles [${req.user.roles.join(', ')}]`,
          403,
          'FORBIDDEN_ROLE'
        )
      );
      return;
    }

    next();
  };
};

export const requirePermission = (...requiredPermissions: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required before checking permissions', 401, 'UNAUTHORIZED'));
      return;
    }

    const hasPermission = requiredPermissions.every((perm) =>
      req.user!.permissions.includes(perm)
    );

    if (!hasPermission) {
      next(
        new AppError(
          `Access forbidden: missing required permission(s) [${requiredPermissions.join(', ')}]`,
          403,
          'FORBIDDEN_PERMISSION'
        )
      );
      return;
    }

    next();
  };
};
