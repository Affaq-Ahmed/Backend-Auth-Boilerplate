import { asyncHandler } from '../../lib/asyncHandler.js';
import UserService from './user.service.js';

const createUser = asyncHandler(async (req, res, next) => {
	const { name, email, password, role = 'USER' } = req.body;
	const user = await UserService.createUser({
		name,
		email,
		password,
		role,
	});
	res.status(201).json(user);
});

const getUsers = asyncHandler(async (req, res, next) => {
	const users = await UserService.getUsers();
	res.status(200).json(users);
});

export default {
	createUser,
	getUsers,
};
