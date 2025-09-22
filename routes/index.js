import express from 'express';
import UserRoutes from './user.route.js';
import AuthRoutes from './auth.route.js';

const router = express.Router();

router.use('/users', UserRoutes);
router.use('/auth', AuthRoutes);

export default router;
