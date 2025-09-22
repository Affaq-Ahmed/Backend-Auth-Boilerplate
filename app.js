import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import addRequestId from 'express-request-id';
import { logger } from './lib/logger.js';
import routes from './routes/index.js';
import { notFound } from './middlewares/not-found.js';
import { errorHandler } from './middlewares/error-handler.js';
import { responseEnvelope } from './lib/ApiResponse.js';

const app = express();

app.use(addRequestId());
app.use(
	pinoHttp({
		logger, // Keep only minimal fields
		serializers: {
			req: (req) => ({
				id: req.id,
				method: req.method,
				url: req.url,
			}),
			res: (res) => ({
				statusCode: res.statusCode,
				message: res.message,
			}),
		},

		// One-liners instead of giant objects
		customSuccessMessage: (req, res) =>
			`${req.method} ${req.url} -> ${res.statusCode}`,
		customErrorMessage: (req, res, err) =>
			`ERR ${req.method} ${req.url} -> ${res.statusCode || 500}: ${err.message}`,

		// Don’t create a noisy child logger per request
		quietReqLogger: true,

		// Only warn/error for 4xx/5xx
		customLogLevel: (res, err) => {
			if (err) return 'error';
			if (res.statusCode >= 500) return 'error';
			if (res.statusCode >= 400) return 'warn';
			return 'info';
		},
	}),
);
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 100,
		standardHeaders: true,
		legacyHeaders: false,
	}),
);

app.use(responseEnvelope);

app.get('/health', (_req, res) => res.json({ status: 'OK' }));

app.use('/api/v1', routes);

// 404
// app.use((req, res) =>
// 	res.status(404).json({
// 		success: false,
// 		statusCode: 404,
// 		code: 'NOT_FOUND',
// 		message: 'Route not found',
// 	}),
// );
app.use(notFound);

// Errors
app.use(errorHandler);

export default app;
