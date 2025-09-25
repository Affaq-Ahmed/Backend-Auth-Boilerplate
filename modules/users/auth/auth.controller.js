import { asyncHandler } from '../../../lib/asyncHandler.js';
import * as AuthService from './auth.service.js';

export const register = asyncHandler(async (req, res) => {
	const { name, email, password, role } = req.body;
	const result = await AuthService.register({ name, email, password, role });
	res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const result = await AuthService.login({ email, password });
	res.status(200).json(result);
});

export const refreshToken = asyncHandler(async (req, res) => {
	const { token } = req.body;
	const result = await AuthService.refreshToken(token);
	res.status(200).json(result);
});
