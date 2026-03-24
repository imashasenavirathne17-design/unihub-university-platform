import express from 'express';
import { getAuditLogs } from '../controllers/auditController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getAuditLogs);

export default router;
