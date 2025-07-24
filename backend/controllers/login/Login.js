import Admin from "../../models/Admin.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { log } from "console";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const LoginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ message: "Admin not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: admin._id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Set token as HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ message: "Log in successfull" });

    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: `Internal Server Error. ${error.message}` });
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
            process.env.JWT_SECRET,
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

export const createAccount = async (req, res) => {
    try {
        const { email, password } = req.body;

        const profilePicture = req.file;

        if (!email || !password)
            return res.status(400).json({ message: "Missing required field" });

        const admin = await Admin.findOne({ email });
        if (admin) return res.status(409).json({ message: "Email is already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            email,
            password: hashedPassword,
            profilePicture: profilePicture.filename
        });

        await newAdmin.save();

        return res.status(200).json({ message: "Successfully created the account" });
    } catch (e) {
        res.status(500).json({ message: `Internal Server Error. ${e.message}` });
    }
}