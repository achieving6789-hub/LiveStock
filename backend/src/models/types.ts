export type UserRole =
  | 'FARMER'
  | 'FIELD_WORKER'
  | 'VETERINARIAN'
  | 'LAB_STAFF'
  | 'DISTRICT_OFFICER'
  | 'STATE_ADMIN'
  | 'SUPER_ADMIN';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type SyncStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';

export type ReportSource = 'MOBILE' | 'OFFLINE' | 'IVR' | 'FIELD_WORKER' | 'VETERINARIAN' | 'LAB' | 'IOT';

export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  passwordHash: string;
  isActive: boolean;
  preferredLanguage: string;
  stateId?: string;
  districtId?: string;
  villageId?: string;
  roles: UserRole[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserDTO {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  isActive: boolean;
  preferredLanguage: string;
  stateId?: string;
  districtId?: string;
  villageId?: string;
  roles: UserRole[];
  permissions: string[];
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuditLogEntry {
  id: string;
  userId?: string;
  userEmail?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  beforeState?: Record<string, unknown>;
  afterState?: Record<string, unknown>;
  statusCode?: number;
  createdAt: string;
}
