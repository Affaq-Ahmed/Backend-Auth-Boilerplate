import { logger } from '../lib/logger.js';
import ApiError from '../lib/ApiError.js';

const isProd = process.env.NODE_ENV === 'production';

function formatMongooseValidation(err) {
	// mongoose ValidationError details
	return Object.values(err.errors || {}).map((e) => ({
		path: e.path,
		message: e.message,
		kind: e.kind,
	}));
}

function toApiError(err) {
	if (err instanceof ApiError) return err;

	// JWT errors
	if (err.name === 'JsonWebTokenError') {
		return ApiError.unauthorized('Invalid token');
	}
	if (err.name === 'TokenExpiredError') {
		return ApiError.unauthorized('Token expired');
	}

	// Body parser malformed JSON (SyntaxError with a body)
	if (err instanceof SyntaxError && 'body' in err) {
		return ApiError.badRequest('Malformed JSON body');
	}

	// Zod
	if (err.name === 'ZodError') {
		return ApiError.unprocessable('Validation Error', err.flatten());
	}

	// Mongoose
	if (err.name === 'ValidationError') {
		return ApiError.unprocessable(
			'Validation Error',
			formatMongooseValidation(err),
		);
	}
	if (err.name === 'CastError') {
		return ApiError.badRequest(`Invalid value for "${err.path}"`);
	}
	if (err.code === 11000) {
		return ApiError.conflict('Duplicate value', { keyValue: err.keyValue });
	}

	// Rate limit libs often set status = 429
	if (err.status === 429 || err.statusCode === 429) {
		return ApiError.tooMany();
	}

	// Generic fallback
	const status = err.statusCode || err.status || 500;
	const message = err.message || 'Internal Server Error';
	const code = err.code || (status >= 500 ? 'SERVER_ERROR' : 'ERROR');
	return new ApiError(status, message, { code });
}

/**
 * Centralized Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
	if (res.headersSent) return next(err);

	const apiErr = toApiError(err);

	const context = {
		method: req.method,
		url: req.originalUrl,
		reqId: req.id || req.headers['x-request-id'],
		status: apiErr.status,
	};

	// Log the full error object + context
	logger.error({ err, ...context }, apiErr.message);

	// Respect expose flag in prod: show generic message for 5xx by default
	const message =
		isProd && !apiErr.expose && apiErr.status >= 500
			? 'Internal Server Error'
			: apiErr.message;

	return res.status(apiErr.status).json({
		success: false,
		statusCode: apiErr.status,
		code: apiErr.code,
		message,
		...(apiErr.details && { details: apiErr.details }),
		...(!isProd && { stack: apiErr.stack }),
	});
};
