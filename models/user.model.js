import mongoose from 'mongoose';
import { comparePassword, hashPassword } from '../utils/encrypt.js';
import { signAccessToken } from '../utils/jwt.js';

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 30,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		role: {
			type: String,
			enum: ['USER', 'ADMIN', 'GUEST'],
			default: 'USER',
		},
	},
	{ timestamps: true },
);

// hook to hash password before saving
userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		const hashedPassword = await hashPassword(this.password);
		this.password = hashedPassword;
	}
	next();
});

userSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.password;
	return user;
};

userSchema.methods.comparePassword = async function (password) {
	return await comparePassword(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
	const payload = { id: this._id, role: this.role };
	const accessToken = signAccessToken(payload);

	return accessToken;
};

userSchema.methods.generateRefreshToken = function () {
	// Implement JWT refresh token generation logic here
	const payload = { id: this._id, role: this.role };
	const refreshToken = signAccessToken(payload);

	return refreshToken;
};

const User = mongoose.model('User', userSchema);

export default User;
