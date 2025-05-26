import Admin from "../../models/Admin.js";
import Otp from "../../models/Otp.js";
import SendEmail from "../../tools/SendEmail.js";
import bcrypt from "bcrypt";

export const getEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: "Account not found" });

        req.body.adminId = admin._id;
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const generateOTP = async (req, res) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const { adminId, email } = req.body;

        if (!adminId || !email)
            return res.status(400).json({ message: "Admin ID and email are required" });

        const existingOtp = await Otp.findOne({ admin: adminId });

        if (existingOtp) {
            existingOtp.otp = otp;
            await existingOtp.save();
        } else {
            await new Otp({ admin: adminId, otp }).save();
        }

        const html = `
            <div style="font-family: 'Segoe UI', sans-serif; background-color: #121b2b; padding: 40px; color: #ffffff;">
                <div style="max-width: 500px; margin: auto; background-color: #1f2a3e; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); padding: 30px;">
                    <h2 style="color: #00bfff; text-align: center; margin-bottom: 20px;">Email Verification</h2>
                    <p style="font-size: 16px; margin-bottom: 20px;">Hello,<br><br>Use the following One-Time Password (OTP) to verify your email address:</p>
                    <div style="background-color: #00bfff; color: #121b2b; font-size: 32px; font-weight: bold; text-align: center; padding: 15px; border-radius: 6px; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="font-size: 14px; margin-top: 25px; color: #cccccc;">This OTP will expire in 10 minutes. If you didn’t request this, please ignore this email.</p>
                    <p style="font-size: 14px; margin-top: 30px; text-align: center; color: #888;">— Sathsara K.</p>
                </div>
            </div>
        `;

        const emailResult = await SendEmail(email, 'Your OTP Code', html);

        if (emailResult.success) {
            return res.status(200).json({ message: "OTP sent. Check your email." });
        } else {
            return res.status(500).json({ message: "Failed to send OTP", error: emailResult.error });
        }

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};


export const validateOTP = async (req, res) => {
    try {
        const { otp, email } = req.body;

        if (!otp || !email) {
            return res.status(400).json({ message: "OTP and Email are required" });
        }

        // Find the admin using email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Find the OTP using admin ID
        const existingOtp = await Otp.findOne({ admin: admin._id });
        if (!existingOtp) {
            return res.status(404).json({ message: "OTP not found" });
        }

        // Check expiration (5 minutes)
        const otpAge = Date.now() - new Date(existingOtp.createdAt).getTime();
        if (otpAge > 5 * 60 * 1000) {
            await Otp.deleteOne({ admin: admin._id }); // Optional cleanup
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        if (existingOtp.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // OTP is valid
        await Otp.deleteOne({ admin: admin._id });
        res.status(200).json({ message: "OTP validated successfully", adminId: admin._id });

    } catch (error) {
        console.error("OTP Validation Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const changePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Admin email and new password are required" });
        }

        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const otp = await Otp.findOne({ admin: admin._id });
        if (otp && !otp.validated) {
            return res.status(400).json({ message: "Please validate your OTP before changing the password" });
        }

        // Hash the new password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        admin.password = hashedPassword;
        await admin.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
