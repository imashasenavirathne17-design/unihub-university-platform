import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    actionType: {
        type: String,
        enum: [
            'EVENT_CREATED',
            'EVENT_UPDATED',
            'EVENT_DELETED',
            'EVENT_CANCELLED',
            'REMINDER_TRIGGERED',
            'BOOST_ACTIVATED',
            'BOOST_DEACTIVATED',
            'AUTO_REMINDERS_TOGGLED'
        ],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    event: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Index for efficient filtering
auditLogSchema.index({ actionType: 1, createdAt: -1 });
auditLogSchema.index({ user: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
