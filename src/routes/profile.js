import express from "express"
const router = express.Router()
import {deleteAccount,updateProfile, updateProfilePic} from "../controllers/profile.controller.js"
import { auth } from "../middlewares/auth.middleware.js"

//dlt user acc
router.post("/updateProfile",auth,updateProfile)
router.delete("/deleteProfile",auth, deleteAccount)
router.put("/updateProfilePicture", updateProfilePic)
// get enrolled user 

export default router;
