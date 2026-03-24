import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date'],
        validate: {
            validator: function (v) {
                return v > new Date(); // Must be a future date
            },
            message: 'Event date must be in the future'
        }
    },
    time: {
        type: String,
        required: [true, 'Please add a time']
    },
    venue: {
        type: String,
        required: [true, 'Please add a venue']
    },
    capacity: {
        type: Number,
        required: [true, 'Please specify capacity'],
        min: [1, 'Capacity must be at least 1']
    },
    category: {
        type: String,
        required: [true, 'Please specify a category']
    },
    organizer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    registrationDeadline: {
        type: Date,
        required: [true, 'Please add a registration deadline']
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
        default: 'Upcoming'
    },
    boostActive: {
        type: Boolean,
        default: false
    },
    autoRemindersEnabled: {
        type: Boolean,
        default: true
    },
    remindersSent: {
        threeDays: { type: Boolean, default: false },
        oneDay: { type: Boolean, default: false },
        threeHours: { type: Boolean, default: false },
        thirtyMins: { type: Boolean, default: false }
    },
    registeredCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
