import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    googleId: {
        type: String,
        required: false,
        default: ''
    },
    profilePicture: {
        type: String,
        default: '',
    }
})

const Admin = mongoose.model('Admin', adminSchema)
export default Admin