import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/livestock_surveillance'),
  JWT_ACCESS_SECRET: z.string().default('livestock_dev_access_secret_super_secure_key_2026!'),
  JWT_REFRESH_SECRET: z.string().default('livestock_dev_refresh_secret_super_secure_key_2026!'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  ML_SERVICE_URL: z.string().default('http://localhost:8000'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
