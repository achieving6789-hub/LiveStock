import { Router } from 'express';
import { authenticateJwt } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

// Metadata endpoint providing lookup tables for registration & dropdowns
router.get('/meta', (_req, res) => {
  res.json({
    success: true,
    data: {
      states: [
        { id: 'state-tn-01', name: 'Tamil Nadu', code: 'TN' },
        { id: 'state-mh-01', name: 'Maharashtra', code: 'MH' },
      ],
      districts: [
        { id: 'dist-salem-01', stateId: 'state-tn-01', name: 'Salem', code: 'TN-SLM' },
        { id: 'dist-erode-01', stateId: 'state-tn-01', name: 'Erode', code: 'TN-ERD' },
        { id: 'dist-pune-01', stateId: 'state-mh-01', name: 'Pune', code: 'MH-PUN' },
      ],
      villages: [
        { id: 'vil-kallanur-01', name: 'Kallanur', districtId: 'dist-salem-01', lat: 11.5985, lng: 78.5991 },
        { id: 'vil-mallur-01', name: 'Mallur', districtId: 'dist-salem-01', lat: 11.5432, lng: 78.1812 },
        { id: 'vil-taramangalam-01', name: 'Tharamangalam', districtId: 'dist-salem-01', lat: 11.6974, lng: 77.9782 },
        { id: 'vil-anthiyur-01', name: 'Anthiyur', districtId: 'dist-erode-01', lat: 11.5794, lng: 77.5857 },
      ],
      species: [
        { id: 'sp-bovine-01', name: 'Cattle' },
        { id: 'sp-buffalo-01', name: 'Buffalo' },
        { id: 'sp-caprine-01', name: 'Goat' },
        { id: 'sp-ovine-01', name: 'Sheep' },
        { id: 'sp-poultry-01', name: 'Poultry' },
      ],
      demoCredentials: [
        { role: 'FARMER', email: 'farmer@livestock.gov', name: 'Ramesh Kumar (Farmer)' },
        { role: 'FIELD_WORKER', email: 'fieldworker@livestock.gov', name: 'Anitha Selvam (Para-Vet)' },
        { role: 'VETERINARIAN', email: 'vet@livestock.gov', name: 'Dr. Sundaramurthy (Vet Surgeon)' },
        { role: 'LAB_STAFF', email: 'lab@livestock.gov', name: 'Dr. Priya Sharma (Microbiologist)' },
        { role: 'DISTRICT_OFFICER', email: 'district@livestock.gov', name: 'Dr. K. Natarajan (District Officer)' },
        { role: 'STATE_ADMIN', email: 'state@livestock.gov', name: 'Dr. V. Rajendran (State Epidemiologist)' },
        { role: 'SUPER_ADMIN', email: 'admin@livestock.gov', name: 'System Super Administrator' },
      ],
      defaultPassword: 'DemoPass123!',
    },
  });
});

// Role Verification Canary Endpoints
router.get('/farmer', authenticateJwt, requireRole('FARMER', 'SUPER_ADMIN'), (req, res) => {
  res.json({ success: true, message: 'Authorized access to FARMER scope', user: req.user });
});

router.get('/field-worker', authenticateJwt, requireRole('FIELD_WORKER', 'SUPER_ADMIN'), (req, res) => {
  res.json({ success: true, message: 'Authorized access to FIELD_WORKER scope', user: req.user });
});

router.get('/veterinarian', authenticateJwt, requireRole('VETERINARIAN', 'SUPER_ADMIN'), (req, res) => {
  res.json({ success: true, message: 'Authorized access to VETERINARIAN scope', user: req.user });
});

router.get('/lab-staff', authenticateJwt, requireRole('LAB_STAFF', 'SUPER_ADMIN'), (req, res) => {
  res.json({ success: true, message: 'Authorized access to LAB_STAFF scope', user: req.user });
});

router.get('/district-officer', authenticateJwt, requireRole('DISTRICT_OFFICER', 'SUPER_ADMIN'), (req, res) => {
  res.json({ success: true, message: 'Authorized access to DISTRICT_OFFICER scope', user: req.user });
});

router.get('/state-admin', authenticateJwt, requireRole('STATE_ADMIN', 'SUPER_ADMIN'), (req, res) => {
  res.json({ success: true, message: 'Authorized access to STATE_ADMIN scope', user: req.user });
});

router.get('/super-admin', authenticateJwt, requireRole('SUPER_ADMIN'), (req, res) => {
  res.json({ success: true, message: 'Authorized access to SUPER_ADMIN scope', user: req.user });
});

export default router;
