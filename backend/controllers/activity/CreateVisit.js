import ActivityLog from "../../models/ActivityLog.js";

export const createVisit = async (req, res) => {
    try {
        const { ip, location, browser, device } = req.trackingData;

        const now = new Date().toISOString();

        let log = await ActivityLog.findOne({ ip });

        if (!log) {
            log = new ActivityLog({
                ip,
                userType: 'user',
                location,
                browser,
                device,
                firstSeen: now,
                lastSeen: now,
                totalActions: 1,
                activities: [{
                    id: Date.now(), // simplistic unique ID
                    action: 'Visited portfolio',
                    timestamp: now,
                    type: 'visit',
                    details: 'Landing page view'
                }]
            });
        } else {
            log.lastSeen = now;
            log.totalActions += 1;
            log.activities.push({
                id: Date.now(),
                action: 'Visited portfolio',
                timestamp: now,
                type: 'visit',
                details: 'Landing page view'
            });
        }

        await log.save();
        res.status(201).json({ message: 'Visit logged', log });

    } catch (error) {
        res.status(500).json({ error: 'Failed to log visit', message: error.message });
    }
};
