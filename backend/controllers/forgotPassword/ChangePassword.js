import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../../models/Admin.js";

export const ResetPassword = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.decode(token);
        console.log(decoded);

        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const { newPassword, confirmPassword } = req.body;

        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ message: "Both fields are required" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        await admin.save();

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

