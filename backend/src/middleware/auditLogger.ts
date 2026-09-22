import type { Request, Response, NextFunction } from 'express';
import { dbService } from '../config/db.js';

export const logAuditEvent = (action: string, resourceType: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const originalSend = res.send;

    res.send = function (body) {
      try {
        dbService.auditLogs.unshift({
          id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          userId: req.user?.id,
          userEmail: req.user?.email,
          action,
          resourceType,
          resourceId: (req.params.id as string) || undefined,
          ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
          userAgent: req.get('user-agent'),
          beforeState: undefined,
          afterState: req.method !== 'GET' ? req.body : undefined,
          statusCode: res.statusCode,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Audit logging error:', err);
      }
      return originalSend.call(this, body);
    };

    next();
  };
};
