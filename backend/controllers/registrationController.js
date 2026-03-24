import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

// @desc    Register for an event
// @route   POST /api/registrations/:eventId
// @access  Private/Student
export const registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userId = req.user._id;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if event is cancelled or completed
        if (event.status === 'Cancelled' || event.status === 'Completed') {
            return res.status(400).json({ message: `Cannot register for a ${event.status.toLowerCase()} event` });
        }

        // Check capacity limit
        if (event.registeredCount >= event.capacity) {
            return res.status(400).json({ message: 'Event is fully booked' });
        }

        // Check registration deadline
        if (new Date() > new Date(event.registrationDeadline)) {
            return res.status(400).json({ message: 'Registration deadline has passed' });
        }

        // Prevent duplicate registrations
        const existingRegistration = await Registration.findOne({ user: userId, event: eventId });
        if (existingRegistration && existingRegistration.status !== 'Cancelled') {
            return res.status(400).json({ message: 'You are already registered for this event' });
        }

        // If they previously cancelled, they could re-register or we can update. Let's create or update.
        let registration;
        if (existingRegistration && existingRegistration.status === 'Cancelled') {
            existingRegistration.status = 'Registered';
            registration = await existingRegistration.save();
        } else {
            registration = await Registration.create({
                user: userId,
                event: eventId,
                status: 'Registered'
            });
        }

        // Increment registered count
        event.registeredCount += 1;
        await event.save();

        res.status(201).json(registration);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel registration
// @route   PUT /api/registrations/:eventId/cancel
// @access  Private/Student
export const cancelRegistration = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userId = req.user._id;

        const registration = await Registration.findOne({ user: userId, event: eventId });

        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        if (registration.status === 'Cancelled') {
            return res.status(400).json({ message: 'Registration is already cancelled' });
        }

        registration.status = 'Cancelled';
        await registration.save();

        // Decrement registered count
        const event = await Event.findById(eventId);
        if (event && event.registeredCount > 0) {
            event.registeredCount -= 1;
            await event.save();
        }

        res.json({ message: 'Registration cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's registrations
// @route   GET /api/registrations/my
// @access  Private
export const getMyRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({ user: req.user._id }).populate('event');
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get registrations for an event (Admin)
// @route   GET /api/registrations/event/:eventId
// @access  Private/Admin
export const getEventRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({ event: req.params.eventId }).populate('user', 'name email');
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
