import { dbService } from '../config/db.js';
import type { User, UserDTO, UserRole } from '../models/types.js';
import bcrypt from 'bcryptjs';

export class UserRepository {
  public static async findByEmail(email: string): Promise<User | null> {
    const cleanEmail = email.toLowerCase().trim();
    const user = dbService.users.get(cleanEmail);
    return user || null;
  }

  public static async findById(id: string): Promise<User | null> {
    for (const user of dbService.users.values()) {
      if (user.id === id) {
        return user;
      }
    }
    return null;
  }

  public static async createUser(userData: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role: UserRole;
    preferredLanguage?: string;
    stateId?: string;
    districtId?: string;
    villageId?: string;
  }): Promise<User> {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(userData.password, salt);
    const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

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

    const newUser: User = {
      id,
      email: userData.email.toLowerCase().trim(),
      phone: userData.phone,
      fullName: userData.fullName,
      passwordHash,
      isActive: true,
      preferredLanguage: userData.preferredLanguage || 'en',
      stateId: userData.stateId,
      districtId: userData.districtId,
      villageId: userData.villageId,
      roles: [userData.role],
      permissions: defaultRolePermissions[userData.role] || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbService.users.set(newUser.email, newUser);
    return newUser;
  }

  public static toDTO(user: User): UserDTO {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      isActive: user.isActive,
      preferredLanguage: user.preferredLanguage,
      stateId: user.stateId,
      districtId: user.districtId,
      villageId: user.villageId,
      roles: user.roles,
      permissions: user.permissions,
      createdAt: user.createdAt,
    };
  }

  public static saveRefreshToken(userId: string, token: string, expiresAt: Date): void {
    dbService.refreshTokens.set(token, {
      userId,
      expiresAt,
      revoked: false,
    });
  }

  public static getRefreshToken(token: string) {
    return dbService.refreshTokens.get(token) || null;
  }

  public static revokeRefreshToken(token: string): void {
    const entry = dbService.refreshTokens.get(token);
    if (entry) {
      entry.revoked = true;
    }
  }

  public static getAllUsers(): UserDTO[] {
    return Array.from(dbService.users.values()).map(this.toDTO);
  }
}
