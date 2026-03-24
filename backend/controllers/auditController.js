import AuditLog from '../models/AuditLog.js';

// Helper function — used internally by other controllers to create audit entries
export const createAuditLog = async ({ user, actionType, description, event, metadata }) => {
    try {
        await AuditLog.create({ user, actionType, description, event, metadata });
    } catch (error) {
        console.error('[Audit] Failed to create audit log:', error.message);
    }
};

// @desc    Get audit logs with filtering
// @route   GET /api/audit
// @access  Private/Admin
export const getAuditLogs = async (req, res) => {
    try {
        const { actionType, startDate, endDate, userId, page = 1 } = req.query;
        const limit = 50;
        const skip = (parseInt(page) - 1) * limit;

        const filter = {};

        if (actionType) {
            filter.actionType = actionType;
        }

        if (userId) {
            filter.user = userId;
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const [logs, totalCount] = await Promise.all([
            AuditLog.find(filter)
                .populate('user', 'name email role')
                .populate('event', 'title')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            AuditLog.countDocuments(filter)
        ]);

        res.json({
            logs,
            totalCount,
            page: parseInt(page),
            totalPages: Math.ceil(totalCount / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
