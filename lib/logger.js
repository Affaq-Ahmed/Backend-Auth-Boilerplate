// import { createLogger, transports, format } from 'winston';

// const logger = createLogger({
//   level: 'info',
//   format: format.combine(
//     format.timestamp(),
//     format.printf(({ timestamp, level, message }) => {
//       return `${timestamp} [${level.toUpperCase()}]: ${message}`;
//     }),
//   ),
//   transports: [
//     new transports.Console(),
//     new transports.File({ filename: 'logs/error.log', level: 'error' }),
//     new transports.File({ filename: 'logs/combined.log' }),
//   ],
// });

// export default logger;

import pino from 'pino';
import { env } from '../config/env.js';

const isDev = env.NODE_ENV !== 'production';

export const logger = pino({
	level: env.LOG_LEVEL,
	transport: isDev
		? {
				target: 'pino-pretty',
				options: { colorize: true, translateTime: 'SYS:standard' },
			}
		: undefined,
	base: undefined, // do not add pid/hostname by default
});
