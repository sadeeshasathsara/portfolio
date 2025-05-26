import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    otp: {
        type: String,
        required: true,
        maxlength: 6,
        minlength: 6
    },
    validated: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;