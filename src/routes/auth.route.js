import express from "express"
const router = express.Router()
import {sendOTP, signup, login} from "../controllers/auth.controller.js"
import { resetPassword,resetPasswordToken } from "../controllers/resetPassword.controller.js"
// import {auth, isStudent, isAdmin, isInstructor} from "../middlewares/auth.middleware.js"
router.post("/sendOTP" ,sendOTP)
router.post("/signup" ,signup)
router.post("/login" ,login)
router.post("/reset-password-token", resetPasswordToken)
router.post("/reset-password", resetPassword)

export default router;