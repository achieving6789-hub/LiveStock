export type UserRole =
  | 'FARMER'
  | 'FIELD_WORKER'
  | 'VETERINARIAN'
  | 'LAB_STAFF'
  | 'DISTRICT_OFFICER'
  | 'STATE_ADMIN'
  | 'SUPER_ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
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

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

export interface CanaryMeta {
  states: Array<{ id: string; name: string; code: string }>;
  districts: Array<{ id: string; stateId: string; name: string; code: string }>;
  villages: Array<{ id: string; name: string; districtId: string; lat: number; lng: number }>;
  species: Array<{ id: string; name: string }>;
  demoCredentials: Array<{ role: UserRole; email: string; name: string }>;
  defaultPassword: string;
}
