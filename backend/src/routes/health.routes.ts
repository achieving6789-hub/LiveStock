import { Router } from 'express';
import { HealthController } from '../controllers/health.controller.js';
import { authenticateJwt } from '../middleware/auth.js';
import { logAuditEvent } from '../middleware/auditLogger.js';

const router = Router();

// Protected with JWT
router.use(authenticateJwt);

router.get('/animals', HealthController.getAnimals);
router.post('/animals', logAuditEvent('ANIMAL_CREATE', 'ANIMAL'), HealthController.createAnimal);
router.get('/animals/:id/timeline', HealthController.getAnimalTimeline);

router.get('/health-reports', HealthController.getHealthReports);
router.post('/health-reports', logAuditEvent('HEALTH_REPORT_CREATE', 'HEALTH_REPORT'), HealthController.createHealthReport);

router.get('/mortality', HealthController.getMortalityReports);
router.post('/mortality', logAuditEvent('MORTALITY_REPORT_CREATE', 'MORTALITY_REPORT'), HealthController.createMortalityReport);

export default router;
