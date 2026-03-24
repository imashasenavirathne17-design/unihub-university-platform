import express from 'express';
import { getAtRiskEvents } from '../controllers/riskController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getAtRiskEvents);

export default router;
