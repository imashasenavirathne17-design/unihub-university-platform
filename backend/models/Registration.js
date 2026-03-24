import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true
    },
    status: {
        type: String,
        enum: ['Registered', 'Attended', 'Cancelled'],
        default: 'Registered'
    }
}, {
    timestamps: true
});

// Prevent duplicate registrations
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
