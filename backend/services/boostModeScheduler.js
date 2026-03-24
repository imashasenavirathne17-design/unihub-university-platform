import cron from 'node-cron';
import Event from '../models/Event.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

const startBoostModeScheduler = () => {
    // Run daily at midnight to check for events to boost
    // For demonstration, you could change this to run every hour e.g., '0 * * * *'
    cron.schedule('0 0 * * *', async () => {
        console.log('[Scheduler] Running Micro-Event Boost Mode check...');
        try {
            const now = new Date();

            // Find events that are:
            // - Upcoming
            // - Capacity <= 50
            // - Boost not already active
            const candidateEvents = await Event.find({
                status: 'Upcoming',
                capacity: { $lte: 50 },
                boostActive: false
            });

            for (const event of candidateEvents) {
                const timeDiffMs = new Date(event.registrationDeadline) - now;
                const daysToDeadline = timeDiffMs / (1000 * 60 * 60 * 24);

                const bookingRate = (event.registeredCount / event.capacity) * 100;

                // If deadline is within 3 days and booking rate is less than 30%
                if (daysToDeadline > 0 && daysToDeadline <= 3 && bookingRate < 30) {
                    event.boostActive = true;
                    await event.save();
                    console.log(`[Scheduler] Activated Boost Mode for event: ${event.title}`);

                    // Optionally, notify all students to boost the event
                    const students = await User.find({ role: 'Student' });

                    if (students.length > 0) {
                        const notificationsToInsert = students.map((student) => ({
                            user: student._id,
                            type: 'Promo',
                            message: `Trending Now: Don't miss out on "${event.title}"! Few spots left.`,
                            event: event._id
                        }));

                        await Notification.insertMany(notificationsToInsert);
                        console.log(`[Scheduler] Sent promo notifications for event: ${event.title}`);
                    }
                }
            }
        } catch (error) {
            console.error(`[Scheduler] Boost Mode Job error: ${error.message}`);
        }
    });
};

export default startBoostModeScheduler;
