import express from 'express'
import { createAccount, LoginWithEmail } from '../controllers/login/Login.js'
import { uploadImage } from '../middlewares/UploadMiddlewareCtrl.js'
import { verifyAuthToken } from '../tools/CheckAuth.js'
import logOut from '../controllers/logOut/logOut.js'
import { changePassword, generateOTP, getEmail, validateOTP } from '../controllers/forgotPassword/ForgotPassword.js'

const router = express.Router()

router.get("/check-auth", verifyAuthToken, (req, res) => {
    res.status(200).json({ message: "User is authenticated" })
})

router.post("/login", LoginWithEmail)
router.post("/logout", logOut)

router.post("/forgot-password", getEmail, generateOTP)
router.post("/validate-otp", validateOTP)
router.post("/change-password", changePassword)

router.post("/register", uploadImage.single("profilePicture"), createAccount)

export default router