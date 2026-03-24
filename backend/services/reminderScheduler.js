import cron from 'node-cron';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Notification from '../models/Notification.js';

const sendReminder = async (event, timeLabel, flagName) => {
    try {
        // Check if reminder was already sent
        if (event.remindersSent[flagName]) return;

        // Get all registered users for this event
        const registrations = await Registration.find({ event: event._id, status: 'Registered' }).populate('user');

        if (registrations.length > 0) {
            const notificationsToInsert = registrations.map((reg) => ({
                user: reg.user._id,
                type: 'Reminder',
                message: `Reminder: The event "${event.title}" is starting in ${timeLabel}!`,
                event: event._id
            }));

            await Notification.insertMany(notificationsToInsert);
        }

        // Mark reminder as sent
        event.remindersSent[flagName] = true;
        await event.save();
        console.log(`[Scheduler] Sent ${timeLabel} reminder for event: ${event.title}`);
    } catch (error) {
        console.error(`[Scheduler] Error sending reminder: ${error.message}`);
    }
};

const startReminderScheduler = () => {
    // Run every 10 minutes to check for upcoming events
    cron.schedule('*/10 * * * *', async () => {
        console.log('[Scheduler] Running reminder check...');
        try {
            const now = new Date();

            // Find all upcoming events
            const upcomingEvents = await Event.find({ status: 'Upcoming' });

            for (const event of upcomingEvents) {
                // Skip events where admin has disabled auto-reminders
                if (event.autoRemindersEnabled === false) continue;

                const timeDiffMs = new Date(`${event.date.toISOString().split('T')[0]}T${event.time}`) - now;
                const hoursDiff = timeDiffMs / (1000 * 60 * 60);

                // Check for 3 days reminder
                if (hoursDiff > 48 && hoursDiff <= 72 && !event.remindersSent.threeDays) {
                    await sendReminder(event, '3 days', 'threeDays');
                }

                // Check for 1 day reminder
                if (hoursDiff > 3 && hoursDiff <= 24 && !event.remindersSent.oneDay) {
                    await sendReminder(event, '1 day', 'oneDay');
                }

                // Check for 3 hours reminder
                if (hoursDiff > 0.5 && hoursDiff <= 3 && !event.remindersSent.threeHours) {
                    await sendReminder(event, '3 hours', 'threeHours');
                }

                // Check for 30 mins reminder
                if (hoursDiff > 0 && hoursDiff <= 0.5 && !event.remindersSent.thirtyMins) {
                    await sendReminder(event, '30 minutes', 'thirtyMins');
                }
            }
        } catch (error) {
            console.error(`[Scheduler] Job error: ${error.message}`);
        }
    });
};

export default startReminderScheduler;
