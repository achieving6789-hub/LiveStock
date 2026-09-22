import pg from 'pg';
import { env } from './env.js';
import type { User, UserRole, AuditLogEntry } from '../models/types.js';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

export interface DBClient {
  isPostgresConnected: boolean;
  query: (text: string, params?: unknown[]) => Promise<{ rows: any[]; rowCount: number }>;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private pool: pg.Pool | null = null;
  public isPostgresConnected = false;

  // In-Memory Fallback & Fast-Testing Data Store
  public users: Map<string, User> = new Map();
  public refreshTokens: Map<string, { userId: string; expiresAt: Date; revoked: boolean }> = new Map();
  public auditLogs: AuditLogEntry[] = [];

  private constructor() {
    this.seedDefaultData();
    this.tryConnectPostgres();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private async tryConnectPostgres() {
    try {
      this.pool = new Pool({
        connectionString: env.DATABASE_URL,
        connectionTimeoutMillis: 2000,
      });

      const client = await this.pool.connect();
      client.release();
      this.isPostgresConnected = true;
      console.log('Successfully connected to PostgreSQL database.');
    } catch {
      this.isPostgresConnected = false;
      console.log('PostgreSQL instance not immediately reachable; using in-memory store.');
    }
  }

  private seedDefaultData() {
    // Password hash for 'DemoPass123!'
    const salt = bcrypt.genSaltSync(10);
    const demoPasswordHash = bcrypt.hashSync('DemoPass123!', salt);

    const defaultRolePermissions: Record<UserRole, string[]> = {
      FARMER: ['HEALTH_REPORT_CREATE', 'HEALTH_REPORT_READ_OWN'],
      FIELD_WORKER: ['HEALTH_REPORT_CREATE', 'HEALTH_REPORT_READ_ALL', 'VET_INVESTIGATION_START'],
      VETERINARIAN: ['VET_INVESTIGATION_START', 'VET_INVESTIGATION_MANAGE', 'LAB_SAMPLE_REQUEST', 'HEALTH_REPORT_READ_ALL'],
      LAB_STAFF: ['LAB_SAMPLE_PROCESS', 'LAB_RESULT_VALIDATE'],
      DISTRICT_OFFICER: ['SURVEILLANCE_DISTRICT_VIEW', 'HEALTH_REPORT_READ_ALL'],
      STATE_ADMIN: ['SURVEILLANCE_STATE_VIEW', 'SURVEILLANCE_DISTRICT_VIEW', 'HEALTH_REPORT_READ_ALL'],
      SUPER_ADMIN: [
        'ADMIN_USER_MANAGE',
        'ADMIN_AUDIT_VIEW',
        'SURVEILLANCE_STATE_VIEW',
        'SURVEILLANCE_DISTRICT_VIEW',
        'HEALTH_REPORT_READ_ALL',
        'VET_INVESTIGATION_MANAGE',
        'LAB_RESULT_VALIDATE'
      ],
    };

    const seedUsers: Array<{
      id: string;
      email: string;
      fullName: string;
      phone: string;
      roles: UserRole[];
      preferredLanguage: string;
      stateId?: string;
      districtId?: string;
      villageId?: string;
    }> = [
      {
        id: 'usr-farmer-01',
        email: 'farmer@livestock.gov',
        fullName: 'Ramesh Kumar (Farmer)',
        phone: '+919876543210',
        roles: ['FARMER'],
        preferredLanguage: 'en',
        stateId: 'state-tn-01',
        districtId: 'dist-salem-01',
        villageId: 'vil-kallanur-01',
      },
      {
        id: 'usr-field-01',
        email: 'fieldworker@livestock.gov',
        fullName: 'Anitha Selvam (Field Para-Vet)',
        phone: '+919876543211',
        roles: ['FIELD_WORKER'],
        preferredLanguage: 'ta',
        stateId: 'state-tn-01',
        districtId: 'dist-salem-01',
        villageId: 'vil-kallanur-01',
      },
      {
        id: 'usr-vet-01',
        email: 'vet@livestock.gov',
        fullName: 'Dr. Sundaramurthy B.V.Sc (Veterinary Surgeon)',
        phone: '+919876543212',
        roles: ['VETERINARIAN'],
        preferredLanguage: 'en',
        stateId: 'state-tn-01',
        districtId: 'dist-salem-01',
        villageId: 'vil-kallanur-01',
      },
      {
        id: 'usr-lab-01',
        email: 'lab@livestock.gov',
        fullName: 'Dr. Priya Sharma (Senior Microbiologist)',
        phone: '+919876543213',
        roles: ['LAB_STAFF'],
        preferredLanguage: 'en',
        stateId: 'state-tn-01',
        districtId: 'dist-salem-01',
      },
      {
        id: 'usr-district-01',
        email: 'district@livestock.gov',
        fullName: 'Dr. K. Natarajan (District Animal Husbandry Officer)',
        phone: '+919876543214',
        roles: ['DISTRICT_OFFICER'],
        preferredLanguage: 'en',
        stateId: 'state-tn-01',
        districtId: 'dist-salem-01',
      },
      {
        id: 'usr-state-01',
        email: 'state@livestock.gov',
        fullName: 'Dr. V. Rajendran (State Epidemiologist)',
        phone: '+919876543215',
        roles: ['STATE_ADMIN'],
        preferredLanguage: 'en',
        stateId: 'state-tn-01',
      },
      {
        id: 'usr-super-01',
        email: 'admin@livestock.gov',
        fullName: 'System Super Administrator',
        phone: '+919876543216',
        roles: ['SUPER_ADMIN'],
        preferredLanguage: 'en',
      },
    ];

    for (const u of seedUsers) {
      const perms = Array.from(new Set(u.roles.flatMap((r) => defaultRolePermissions[r] || [])));
      const user: User = {
        ...u,
        passwordHash: demoPasswordHash,
        isActive: true,
        permissions: perms,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.users.set(user.email.toLowerCase(), user);
    }
  }
}

export const dbService = DatabaseService.getInstance();
