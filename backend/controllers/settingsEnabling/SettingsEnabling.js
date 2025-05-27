import Settings from "../../models/Settings.js";
import jwt from "jsonwebtoken";

// Helper: authorize & get/create main settings document
const getMainSettings = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }

    let settings = await Settings.findOne();

    if (!settings) {
        settings = new Settings();
        await settings.save();
    }

    return settings;
};


// Generic update handler
const updateSetting = (key) => async (req, res) => {
    try {
        const settings = await getMainSettings(req, res);
        if (!settings._id) return; // Error already sent

        const value = req.body.value;
        if (typeof value !== "boolean") {
            return res.status(400).json({ message: "Invalid value, must be boolean" });
        }

        settings[key] = value;
        await settings.save();

        return res.status(200).json({ message: `${key} updated`, [key]: value });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const updateTwoFactor = updateSetting("twoFactor");
export const updateGoogleAuth = updateSetting("GoogleAuth");
export const updatePasswordAuth = updateSetting("PasswordAuth");
export const updateEmailInquiryNotify = updateSetting("EmailInquiryNotify");
export const updateUserVisitNotify = updateSetting("UserVisitNotify");
export const updateCvDownloadNotify = updateSetting("CvDownloadNotify");
export const updateProjectViewNotify = updateSetting("ProjectViewNotify");
