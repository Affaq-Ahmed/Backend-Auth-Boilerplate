import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

export async function connectDB() {
	mongoose.set('strictQuery', true);
	await mongoose.connect(env.MONGO_URI);
	logger.info('🗄️ MongoDB connected');
}
