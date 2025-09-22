import User from '../models/user.model.js';
import { verifyAccessToken } from '../utils/jwt.js';

export const authenticate = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];
		if (!token) {
			next(new Error('Token is required'));
		}
		const decoded = verifyAccessToken(token);

		const user = await User.findById(decoded.userId);
		if (!user) {
			next(new Error('User not found'));
		}

		req.user = user;
		req.token = token;

		next();
	} catch (error) {
		next(new Error('Invalid Token'));
	}
};
