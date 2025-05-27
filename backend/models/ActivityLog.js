import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    id: Number,
    action: String,
    timestamp: String,
    type: String,
    details: String
}, { _id: false }); // prevent automatic _id for subdocs

const activityLogSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
        unique: true
    },
    userType: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    location: String,
    browser: String,
    device: String,
    email: {
        type: String,
        default: ''
    },
    firstSeen: String,
    lastSeen: String,
    totalActions: Number,
    activities: [activitySchema]
}, { timestamps: true });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
