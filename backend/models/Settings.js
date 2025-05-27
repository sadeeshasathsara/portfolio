import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    twoFactor: {
        type: Boolean,
        default: false,
    },
    GoogleAuth: {
        type: Boolean,
        default: false
    },
    PasswordAuth: {
        type: Boolean,
        default: true
    },
    EmailInquiryNotify: {
        type: Boolean,
        default: true
    },
    UserVisitNotify: {
        type: Boolean,
        default: false
    },
    CvDownloadNotify: {
        type: Boolean,
        default: false
    },
    ProjectViewNotify: {
        type: Boolean,
        default: false
    }
})

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;