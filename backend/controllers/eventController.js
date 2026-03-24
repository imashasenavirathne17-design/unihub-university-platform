import Event from '../models/Event.js';
import { createAuditLog } from './auditController.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({}).populate('organizer', 'name email');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer', 'name email');

        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res) => {
    try {
        const { title, description, date, time, venue, capacity, category, registrationDeadline } = req.body;

        const event = new Event({
            title,
            description,
            date,
            time,
            venue,
            capacity,
            category,
            organizer: req.user._id,
            registrationDeadline
        });

        const createdEvent = await event.save();

        await createAuditLog({
            user: req.user._id,
            actionType: 'EVENT_CREATED',
            description: `Created event "${createdEvent.title}"`,
            event: createdEvent._id,
            metadata: { title, category, capacity }
        });

        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res) => {
    try {
        const { title, description, date, time, venue, capacity, category, registrationDeadline, status } = req.body;

        const event = await Event.findById(req.params.id);

        if (event) {
            event.title = title || event.title;
            event.description = description || event.description;
            event.date = date || event.date;
            event.time = time || event.time;
            event.venue = venue || event.venue;
            event.capacity = capacity || event.capacity;
            event.category = category || event.category;
            event.registrationDeadline = registrationDeadline || event.registrationDeadline;
            event.status = status || event.status;

            const updatedEvent = await event.save();

            await createAuditLog({
                user: req.user._id,
                actionType: 'EVENT_UPDATED',
                description: `Updated event "${updatedEvent.title}"`,
                event: updatedEvent._id,
                metadata: req.body
            });

            res.json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            const eventTitle = event.title;
            const eventId = event._id;
            await event.deleteOne();

            await createAuditLog({
                user: req.user._id,
                actionType: 'EVENT_DELETED',
                description: `Deleted event "${eventTitle}"`,
                event: eventId
            });

            res.json({ message: 'Event removed' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
