import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// @desc    Get events with risk analysis
// @route   GET /api/risk
// @access  Private/Admin
export const getAtRiskEvents = async (req, res) => {
    try {
        const now = new Date();

        // Get all active events
        const events = await Event.find({
            status: { $in: ['Upcoming', 'Ongoing'] }
        }).populate('organizer', 'name email');

        const riskResults = [];
        let highCount = 0, mediumCount = 0, lowCount = 0;

        for (const event of events) {
            const registrationRate = event.capacity > 0
                ? (event.registeredCount / event.capacity) * 100
                : 0;

            const daysToDeadline = (new Date(event.registrationDeadline) - now) / (1000 * 60 * 60 * 24);

            // Calculate drop-off rate from registrations
            const [totalRegs, cancelledRegs] = await Promise.all([
                Registration.countDocuments({ event: event._id }),
                Registration.countDocuments({ event: event._id, status: 'Cancelled' })
            ]);
            const dropOffRate = totalRegs > 0 ? (cancelledRegs / totalRegs) * 100 : 0;

            // Determine risk level
            let riskLevel = 'None';
            const warnings = [];

            if (
                (registrationRate < 20 && daysToDeadline > 0 && daysToDeadline <= 3) ||
                dropOffRate > 50
            ) {
                riskLevel = 'High';
                highCount++;
            } else if (
                (registrationRate < 30 && daysToDeadline > 0 && daysToDeadline <= 7) ||
                dropOffRate > 30
            ) {
                riskLevel = 'Medium';
                mediumCount++;
            } else if (registrationRate < 40 && daysToDeadline > 0 && daysToDeadline <= 14) {
                riskLevel = 'Low';
                lowCount++;
            }

            // Generate warning labels
            if (registrationRate < 30) warnings.push('Low Registration Risk');
            if (daysToDeadline > 0 && daysToDeadline <= 3 && registrationRate < 50) warnings.push('Deadline Approaching');
            if (dropOffRate > 30) warnings.push('High Drop-off Rate');

            if (riskLevel !== 'None') {
                riskResults.push({
                    _id: event._id,
                    title: event.title,
                    date: event.date,
                    category: event.category,
                    venue: event.venue,
                    status: event.status,
                    capacity: event.capacity,
                    registeredCount: event.registeredCount,
                    registrationRate: Math.round(registrationRate * 10) / 10,
                    registrationDeadline: event.registrationDeadline,
                    daysToDeadline: Math.round(daysToDeadline * 10) / 10,
                    dropOffRate: Math.round(dropOffRate * 10) / 10,
                    riskLevel,
                    warnings
                });
            }
        }

        // Sort by risk severity: High first, then Medium, then Low
        const riskOrder = { High: 0, Medium: 1, Low: 2 };
        riskResults.sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);

        res.json({
            summary: {
                totalAtRisk: riskResults.length,
                high: highCount,
                medium: mediumCount,
                low: lowCount,
                totalActiveEvents: events.length
            },
            events: riskResults
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
