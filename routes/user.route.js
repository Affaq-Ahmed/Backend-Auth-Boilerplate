import express from 'express';
import UserController from '../modules/users/user.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

export default router;
