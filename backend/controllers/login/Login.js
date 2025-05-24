import Admin from "../../models/Admin.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const LoginWithUsn = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(401).json({ message: "Admin not found" });
        }

        if (admin.password !== password) {
            return res.status(402).json({ message: "Invalid password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: admin._id, role: "admin" },
            process.env.JWT_SECRET || "your_jwt_secret",
            { expiresIn: "1d" }
        );

        // Set token as HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ message: "Login successful" });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const loginWithGoogle = async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
        return res.status(400).json({ message: "Missing Google credential" });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId, picture } = payload;

        // Check if user exists
        let admin = await Admin.findOne({ email });

        // Generate JWT
        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: "admin" },
            process.env.JWT_SECRET || "your_jwt_secret",
            { expiresIn: "1d" }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ message: "Login successful" });

    } catch (error) {
        res.status(500).json({ message: "Google login failed" });
    }
};