import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Notification from '../models/Notification.js';
import { createAuditLog } from './auditController.js';

// @desc    Manually trigger reminder for an event
// @route   POST /api/overrides/:eventId/trigger-reminder
// @access  Private/Admin
export const triggerReminder = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Get all registered users
        const registrations = await Registration.find({
            event: event._id,
            status: 'Registered'
        }).populate('user');

        if (registrations.length === 0) {
            return res.status(400).json({ message: 'No registered users to notify' });
        }

        const notificationsToInsert = registrations.map((reg) => ({
            user: reg.user._id,
            type: 'Reminder',
            message: `Admin Reminder: Don't forget about "${event.title}" happening on ${new Date(event.date).toLocaleDateString()}!`,
            event: event._id
        }));

        await Notification.insertMany(notificationsToInsert);

        await createAuditLog({
            user: req.user._id,
            actionType: 'REMINDER_TRIGGERED',
            description: `Manually triggered reminder for "${event.title}" — notified ${registrations.length} users`,
            event: event._id,
            metadata: { notifiedCount: registrations.length }
        });

        res.json({
            message: `Reminder sent to ${registrations.length} registered users`,
            notifiedCount: registrations.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle auto-reminders for an event
// @route   PUT /api/overrides/:eventId/auto-reminders
// @access  Private/Admin
export const toggleAutoReminders = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.autoRemindersEnabled = !event.autoRemindersEnabled;
        await event.save();

        await createAuditLog({
            user: req.user._id,
            actionType: 'AUTO_REMINDERS_TOGGLED',
            description: `${event.autoRemindersEnabled ? 'Enabled' : 'Disabled'} auto-reminders for "${event.title}"`,
            event: event._id,
            metadata: { autoRemindersEnabled: event.autoRemindersEnabled }
        });

        res.json({
            message: `Auto-reminders ${event.autoRemindersEnabled ? 'enabled' : 'disabled'} for "${event.title}"`,
            autoRemindersEnabled: event.autoRemindersEnabled
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle boost mode for an event
// @route   PUT /api/overrides/:eventId/boost
// @access  Private/Admin
export const toggleBoostMode = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const wasActive = event.boostActive;
        event.boostActive = !event.boostActive;
        await event.save();

        await createAuditLog({
            user: req.user._id,
            actionType: event.boostActive ? 'BOOST_ACTIVATED' : 'BOOST_DEACTIVATED',
            description: `${event.boostActive ? 'Activated' : 'Deactivated'} boost mode for "${event.title}"`,
            event: event._id,
            metadata: { boostActive: event.boostActive }
        });

        res.json({
            message: `Boost mode ${event.boostActive ? 'activated' : 'deactivated'} for "${event.title}"`,
            boostActive: event.boostActive
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
