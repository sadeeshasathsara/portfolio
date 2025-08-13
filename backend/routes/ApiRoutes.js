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
import { createVisit } from '../controllers/activity/CreateVisit.js'
import { logActivity } from '../controllers/activity/GenericActivity.js'
import { readActivityLogs } from '../controllers/activity/ReadActivity.js'
import Contact from '../controllers/contact/Contact.js'
import Reply from '../controllers/contact/Reply.js'
import ReadMails from '../controllers/contact/Read.js'
import { setRead } from '../controllers/contact/EmailTools.js'
import { getCountsWithInsights, increaseCvDownloads, increasePortfolioVisitors, increaseProjectClicks, increaseTotalProjects } from '../controllers/dashboardCounts/dashboardCounts.js'
import { getCounts } from '../controllers/dashboardCounts/getCounts.js'

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
router.put('/profile', verifyAuthToken, saveProfile);

router.post('/project', verifyAuthToken, createProject);
router.get('/project', getProjects);
router.get('/project/:id', getProjectById);
router.put('/project/:id', verifyAuthToken, updateProject);
router.delete('/project/:id', verifyAuthToken, deleteProject);

router.post("/register", verifyAuthToken, uploadImage.single("profilePicture"), createAccount)

router.put("/settings/two-factor", verifyAuthToken, updateTwoFactor);
router.put("/settings/google-auth", verifyAuthToken, updateGoogleAuth);
router.put("/settings/password-auth", verifyAuthToken, updatePasswordAuth);
router.put("/settings/email-inquiry-notify", verifyAuthToken, updateEmailInquiryNotify);
router.put("/settings/user-visit-notify", verifyAuthToken, updateUserVisitNotify);
router.put("/settings/cv-download-notify", verifyAuthToken, updateCvDownloadNotify);
router.put("/settings/project-view-notify", verifyAuthToken, updateProjectViewNotify);

router.post('/activity/visit', verifyAuthToken, createVisit);
router.post('/activity/log', verifyAuthToken, logActivity);
router.get('/activity/logs', verifyAuthToken, readActivityLogs);

router.post('/contact', Contact)
router.post('/contact/:id/reply', verifyAuthToken, Reply)
router.get('/contact/all', verifyAuthToken, ReadMails)
router.put('/contact/set-read', verifyAuthToken, setRead)

router.post('/portfolio-visitors', verifyAuthToken, increasePortfolioVisitors);
router.post('/total-projects', verifyAuthToken, increaseTotalProjects);
router.post('/project-clicks', verifyAuthToken, increaseProjectClicks);
router.get('/counts', verifyAuthToken, getCounts);
router.get('/counts/insights', verifyAuthToken, getCountsWithInsights);


export default router