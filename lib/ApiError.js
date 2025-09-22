export default class ApiError extends Error {
  constructor(
    status = 500,
    message = 'Internal Server Error',
    { code = 'SERVER_ERROR', details, expose = false, cause } = {}
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.expose = expose; // if true, show message in prod
    if (cause) this.cause = cause;
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', details) {
    return new ApiError(400, message, { code: 'BAD_REQUEST', details, expose: true });
  }
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message, { code: 'UNAUTHORIZED', expose: true });
  }
  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message, { code: 'FORBIDDEN', expose: true });
  }
  static notFound(message = 'Not Found', details) {
    return new ApiError(404, message, { code: 'NOT_FOUND', details, expose: true });
  }
  static conflict(message = 'Conflict', details) {
    return new ApiError(409, message, { code: 'CONFLICT', details, expose: true });
  }
  static unprocessable(message = 'Validation Error', details) {
    return new ApiError(422, message, { code: 'VALIDATION_ERROR', details, expose: true });
  }
  static tooMany(message = 'Too Many Requests') {
    return new ApiError(429, message, { code: 'RATE_LIMITED', expose: true });
  }
}
