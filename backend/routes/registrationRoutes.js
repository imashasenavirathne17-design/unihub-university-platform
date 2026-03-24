import express from 'express';
import { registerForEvent, cancelRegistration, getMyRegistrations, getEventRegistrations } from '../controllers/registrationController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:eventId', protect, registerForEvent);
router.put('/:eventId/cancel', protect, cancelRegistration);
router.get('/my', protect, getMyRegistrations);
router.get('/event/:eventId', protect, admin, getEventRegistrations);

export default router;
