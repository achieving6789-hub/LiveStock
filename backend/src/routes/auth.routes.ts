import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateJwt } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { logAuditEvent } from '../middleware/auditLogger.js';

const router = Router();

router.post('/register', logAuditEvent('USER_REGISTER', 'USER'), AuthController.register);
router.post('/login', logAuditEvent('USER_LOGIN', 'AUTH'), AuthController.login);
router.post('/refresh', AuthController.refreshToken);
router.post('/logout', logAuditEvent('USER_LOGOUT', 'AUTH'), AuthController.logout);
router.get('/me', authenticateJwt, AuthController.getProfile);

// Admin-only endpoints for user & audit log management
router.get('/users', authenticateJwt, requireRole('SUPER_ADMIN'), AuthController.getAllUsers);
router.get(
  '/audit-logs',
  authenticateJwt,
  requireRole('SUPER_ADMIN'),
  AuthController.getAuditLogs
);

export default router;
