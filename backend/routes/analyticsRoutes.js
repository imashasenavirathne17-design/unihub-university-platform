import express from 'express';
import { getDashboardAnalytics, markAttendance } from '../controllers/analyticsController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getDashboardAnalytics);
router.put('/attendance/:registrationId', protect, admin, markAttendance);

export default router;
