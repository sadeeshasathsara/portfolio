import express from 'express'
import { createAccount, LoginWithEmail } from '../controllers/login/Login.js'
import { uploadImage } from '../middlewares/UploadMiddlewareCtrl.js'
import { verifyAuthToken } from '../tools/CheckAuth.js'
import logOut from '../controllers/logOut/logOut.js'
import { changePassword, generateOTP, getEmail, validateOTP } from '../controllers/forgotPassword/ForgotPassword.js'
import { getProfile, saveProfile } from '../controllers/userDetails/UserDetails.js'
import { createProject, deleteProject, getProjectById, getProjects, updateProject } from '../controllers/project/Project.js'
import { ResetPassword } from '../controllers/forgotPassword/ChangePassword.js'
import {
    updateTwoFactor, updateGoogleAuth,
    updatePasswordAuth,
    updateEmailInquiryNotify,
    updateUserVisitNotify,
    updateCvDownloadNotify,
    updateProjectViewNotify,
} from '../controllers/settingsEnabling/SettingsEnabling.js'

const router = express.Router()

router.get("/check-auth", verifyAuthToken, (req, res) => {
    res.status(200).json({ message: "User is authenticated" })
})

router.post("/login", LoginWithEmail)
router.post("/logout", logOut)

router.post("/forgot-password", getEmail, generateOTP)
router.post("/validate-otp", validateOTP)
router.post("/change-password", changePassword)
router.post("/reset-password", ResetPassword)

router.get('/profile', getProfile);
router.put('/profile', saveProfile);

router.post('/project', createProject);
router.get('/project', getProjects);
router.get('/project/:id', getProjectById);
router.put('/project/:id', updateProject);
router.delete('/project/:id', deleteProject);

router.post("/register", uploadImage.single("profilePicture"), createAccount)

router.put("/settings/two-factor", updateTwoFactor);
router.put("/settings/google-auth", updateGoogleAuth);
router.put("/settings/password-auth", updatePasswordAuth);
router.put("/settings/email-inquiry-notify", updateEmailInquiryNotify);
router.put("/settings/user-visit-notify", updateUserVisitNotify);
router.put("/settings/cv-download-notify", updateCvDownloadNotify);
router.put("/settings/project-view-notify", updateProjectViewNotify);

export default router