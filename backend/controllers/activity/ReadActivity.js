import ActivityLog from '../../models/ActivityLog.js';
import jwt from 'jsonwebtoken';

export const readActivityLogs = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);

        const logs = await ActivityLog.find();

        const formattedData = {};

        logs.forEach(log => {
            const {
                ip,
                userType,
                location,
                browser,
                device,
                email,
                activities,
                firstSeen,
                lastSeen
            } = log;

            formattedData[ip] = {
                userType,
                location,
                browser,
                device,
                ...(email && { email }),
                firstSeen,
                lastSeen,
                totalActions: activities.length,
                activities: activities.map((act, index) => ({
                    id: index + 1,
                    action: act.action,
                    timestamp: act.timestamp,
                    type: act.type,
                    details: act.details
                }))
            };
        });

        res.json(formattedData);
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
