import ApiError from '../../../lib/ApiError.js';
import User from '../../../models/user.model.js';
import { verifyRefreshToken } from '../../../utils/jwt.js';

export const register = async function ({
	email,
	name,
	password,
	role = 'USER',
}) {
	const exists = await User.findOne({ email });
	if (exists) ApiError.conflict('Email already in use');

	const user = new User({ name, email, password, role });
	await user.save();
	return {
		user: user.toJSON(),
		message: 'Registration successful',
	};
};

export const login = async function ({ email, password }) {
	const user = await User.findOne({ email });
	if (!user) throw ApiError.unauthorized('Invalid email or password');

	const isMatch = await user.comparePassword(password);
	if (!isMatch) throw ApiError.unauthorized('Invalid email or password');

	const accessToken = user.generateAccessToken();
	const refreshToken = user.generateRefreshToken();

	return {
		user: user.toJSON(),
		tokens: { accessToken, refreshToken },
		message: 'Login successful',
	};
};

export const refreshToken = async function (token) {
	// Implement refresh token logic here
	const decodedRefreshToken = verifyRefreshToken(token);
	if (!decodedRefreshToken.id)
		throw ApiError.unauthorized('Invalid refresh token');

	const user = await User.findById(decodedRefreshToken.id);
	if (!user) throw ApiError.unauthorized('User not found');

	const accessToken = user.generateAccessToken();
	const refreshToken = user.generateRefreshToken();

	return {
		user: user.toJSON(),
		tokens: { accessToken, refreshToken },
	};
};
