import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// @desc    Get system analytics (Admin)
// @route   GET /api/analytics
// @access  Private/Admin
export const getDashboardAnalytics = async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();
        const activeEvents = await Event.countDocuments({ status: { $in: ['Upcoming', 'Ongoing'] } });
        const totalRegistrations = await Registration.countDocuments();

        // Aggregate attendance (registrations with status 'Attended')
        const totalAttended = await Registration.countDocuments({ status: 'Attended' });

        // Events grouped by category for charts
        const eventsByCategory = await Event.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.json({
            totalEvents,
            activeEvents,
            totalRegistrations,
            totalAttended,
            eventsByCategory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark student as attended (Admin/Organizer)
// @route   PUT /api/analytics/attendance/:registrationId
// @access  Private/Admin
export const markAttendance = async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.registrationId);

        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        registration.status = 'Attended';
        await registration.save();

        res.json({ message: 'Attendance marked' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
