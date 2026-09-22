import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  fullName: z.string().min(2, 'Full name must have at least 2 characters').max(150),
  phone: z.string().optional(),
  role: z.enum([
    'FARMER',
    'FIELD_WORKER',
    'VETERINARIAN',
    'LAB_STAFF',
    'DISTRICT_OFFICER',
    'STATE_ADMIN',
    'SUPER_ADMIN',
  ]).default('FARMER'),
  preferredLanguage: z.enum(['en', 'ta', 'mr', 'hi']).default('en'),
  stateId: z.string().optional(),
  districtId: z.string().optional(),
  villageId: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
