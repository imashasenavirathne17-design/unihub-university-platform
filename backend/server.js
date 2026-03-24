import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';

import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import riskRoutes from './routes/riskRoutes.js';
import overrideRoutes from './routes/overrideRoutes.js';

import startReminderScheduler from './services/reminderScheduler.js';
import startBoostModeScheduler from './services/boostModeScheduler.js';

dotenv.config();

// Connect to database
connectDB();

// Start Background Jobs
startReminderScheduler();
startBoostModeScheduler();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/overrides', overrideRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Event Management API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
