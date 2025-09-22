import { env } from './config/env.js';
import { connectDB } from './db/mongo.js';
import { logger } from './lib/logger.js';
import app from './app.js';

async function main() {
	await connectDB();
	app.listen(env.PORT, () => {
		logger.info(`🚀 Server ready on http://localhost:${env.PORT}`);
	});
}

main().catch((err) => {
	// last-resort logging
	console.error(err);
	process.exit(1);
});
