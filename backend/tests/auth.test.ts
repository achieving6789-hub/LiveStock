import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('Authentication & RBAC Test Suite', () => {
  let farmerAccessToken = '';
  let vetAccessToken = '';
  let adminAccessToken = '';
  let farmerRefreshToken = '';

  it('1. GET /health should return status UP', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.version).toBe('1.0.0');
  });

  it('2. POST /api/auth/login with valid Farmer credentials should succeed and return tokens', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'farmer@livestock.gov',
      password: 'DemoPass123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('farmer@livestock.gov');
    expect(res.body.data.user.roles).toContain('FARMER');
    expect(res.body.data.tokens.accessToken).toBeDefined();
    expect(res.body.data.tokens.refreshToken).toBeDefined();

    farmerAccessToken = res.body.data.tokens.accessToken;
    farmerRefreshToken = res.body.data.tokens.refreshToken;
  });

  it('3. POST /api/auth/login with valid Veterinarian credentials should succeed', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'vet@livestock.gov',
      password: 'DemoPass123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.user.roles).toContain('VETERINARIAN');
    vetAccessToken = res.body.data.tokens.accessToken;
  });

  it('4. POST /api/auth/login with valid Super Admin credentials should succeed', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@livestock.gov',
      password: 'DemoPass123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.user.roles).toContain('SUPER_ADMIN');
    adminAccessToken = res.body.data.tokens.accessToken;
  });

  it('5. POST /api/auth/login with invalid password should return 401', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'farmer@livestock.gov',
      password: 'WrongPassword!',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('INVALID_CREDENTIALS');
  });

  it('6. POST /api/auth/register with valid input should create user and return 201', async () => {
    const uniqueEmail = `newuser_${Date.now()}@example.com`;
    const res = await request(app).post('/api/auth/register').send({
      email: uniqueEmail,
      password: 'SecurePassword123!',
      fullName: 'Gopal Krishnan',
      phone: '+919988776655',
      role: 'FARMER',
      preferredLanguage: 'ta',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(uniqueEmail);
    expect(res.body.data.tokens.accessToken).toBeDefined();
  });

  it('7. POST /api/auth/register with duplicate email should return 409', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'farmer@livestock.gov',
      password: 'SecurePassword123!',
      fullName: 'Duplicate Farmer',
      role: 'FARMER',
    });

    expect(res.status).toBe(409);
    expect(res.body.code).toBe('USER_ALREADY_EXISTS');
  });

  it('8. POST /api/auth/register with weak password should return 400 validation error', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'weakpass@example.com',
      password: 'weak',
      fullName: 'Test Weak',
      role: 'FARMER',
    });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('9. POST /api/auth/refresh should rotate and return new access token', async () => {
    const res = await request(app).post('/api/auth/refresh').send({
      refreshToken: farmerRefreshToken,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  it('10. GET /api/auth/me should return authenticated profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${farmerAccessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe('farmer@livestock.gov');
  });

  it('11. RBAC Guard: Farmer accessing Farmer endpoint should succeed (200)', async () => {
    const res = await request(app)
      .get('/api/canary/farmer')
      .set('Authorization', `Bearer ${farmerAccessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('12. RBAC Guard: Farmer accessing Veterinarian endpoint should be forbidden (403)', async () => {
    const res = await request(app)
      .get('/api/canary/veterinarian')
      .set('Authorization', `Bearer ${farmerAccessToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('FORBIDDEN_ROLE');
  });

  it('13. RBAC Guard: Veterinarian accessing Veterinarian endpoint should succeed (200)', async () => {
    const res = await request(app)
      .get('/api/canary/veterinarian')
      .set('Authorization', `Bearer ${vetAccessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('14. RBAC Guard: Veterinarian accessing Super Admin endpoint should be forbidden (403)', async () => {
    const res = await request(app)
      .get('/api/canary/super-admin')
      .set('Authorization', `Bearer ${vetAccessToken}`);

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('FORBIDDEN_ROLE');
  });

  it('15. RBAC Guard: Super Admin accessing Super Admin endpoint should succeed (200)', async () => {
    const res = await request(app)
      .get('/api/canary/super-admin')
      .set('Authorization', `Bearer ${adminAccessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('16. Unauthenticated request without token should return 401', async () => {
    const res = await request(app).get('/api/canary/farmer');
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('UNAUTHORIZED');
  });
});
