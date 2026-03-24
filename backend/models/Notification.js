import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['Reminder', 'Promo', 'System', 'Cancellation'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    event: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event'
    },
    readStatus: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
