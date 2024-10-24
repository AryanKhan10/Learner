import mongoose from "mongoose";
import mailSender from "../utiles/mailSender.js";
import { decrypt } from "../utiles/cipher.js";
const OTPSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        otp: {
            type: String,
            required: true
        },
        otpSecret: {
            type: String, 
            required: true 
        }, // Encrypted secret key
        otpIv: { 
            type: String, 
            required: true 
        }, // Initialization vector for decryption
        createdAt: {
            type:Date,
            default:Date.now(),
            expires: 5*60
        }
        
    }
);

const sendVerificationMail = async (email, otp) => {
    try {
        // console.log(email,otp)
        const mailResponse = await mailSender(email,"verification Email from Learner", otp);
        // console.log("mailResponse: ",mailResponse);
     } catch (error) {
        console.log("Error while sending verification mail: ",error);
        throw error;
    }
}

OTPSchema.pre("save", async function(next){
    const decOtp = decrypt({ iv: this.otpIv, encryptedData: this.otp })
   await sendVerificationMail(this.email, decOtp);
   next()
})
export const OTP = mongoose.model("OTP", OTPSchema)