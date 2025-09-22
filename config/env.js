import dotenv from 'dotenv';
dotenv.config();
import { z } from 'zod';

const envSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'test', 'production'])
		.default('development'),
	PORT: z.coerce.number().default(8000),
	MONGO_URI: z.string().min(1),
	JWT_ACCESS_SECRET: z.string().min(16),
	JWT_REFRESH_SECRET: z.string().min(16),
	JWT_ACCESS_EXPIRES: z.string().default('15m'),
	JWT_REFRESH_EXPIRES: z.string().default('7d'),
	BCRYPT_SALT_ROUNDS: z.coerce.number().min(4).max(15).default(12),
	LOG_LEVEL: z
		.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
		.default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	// Format Zod errors for visibility
	console.error(
		'❌ Invalid environment variables:',
		parsed.error.flatten().fieldErrors,
	);
	process.exit(1);
}

export const env = parsed.data;
