import ActivityLog from "../../models/ActivityLog.js";

export const logActivity = async (req, res) => {
    try {
        const { ip } = req.trackingData;
        const { type, action, details } = req.body;

        const now = new Date().toISOString();

        const log = await ActivityLog.findOne({ ip });
        if (!log) return res.status(404).json({ error: 'Activity log not found for this IP' });

        log.lastSeen = now;
        log.totalActions += 1;
        log.activities.push({
            id: Date.now(),
            action,
            timestamp: now,
            type,
            details
        });

        await log.save();
        res.status(201).json({ message: 'Activity logged', log });

    } catch (error) {
        res.status(500).json({ error: 'Failed to log activity', message: error.message });
    }
};
