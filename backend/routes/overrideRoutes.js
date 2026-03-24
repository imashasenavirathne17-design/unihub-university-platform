import express from 'express';
import { triggerReminder, toggleAutoReminders, toggleBoostMode } from '../controllers/overrideController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:eventId/trigger-reminder', protect, admin, triggerReminder);
router.put('/:eventId/auto-reminders', protect, admin, toggleAutoReminders);
router.put('/:eventId/boost', protect, admin, toggleBoostMode);

export default router;
