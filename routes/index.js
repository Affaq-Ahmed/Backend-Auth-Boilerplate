import express from 'express';
import UserRoutes from './user.route.js';

const router = express.Router();

router.use('/users', UserRoutes);
router.use('/auth', UserRoutes);

export default router;
