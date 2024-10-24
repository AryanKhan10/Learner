import {User} from "../models/user.model.js"
import {OTP} from "../models/otp.model.js"
import otpGenerator from "otp-generator"
import {Profile} from "../models/profile.model.js"
import jwt from "jsonwebtoken"
import {encrypt, decrypt} from "../utiles/cipher.js"
import speakeasy from "speakeasy"
import bcrypt from "bcrypt"
// send otp
const sendOTP = async (req, res) =>{
    try {
        // console.log(req.body)
        const {email} = req.body
    const emailCheck = await User.findOne({email})

    if(emailCheck){
        return res.status(403).json({
            success:false,
            message:"User already Exist. "
        })
    }

    //otp generate
    // var otp = otpGenerator.generate(6,{
    //     lowerCaseAlphabets:false,
    //     upperCaseAlphabets:false,
    //     specialChars:false
    // });

    // Generate a secret key using speakeasy
    const secret = speakeasy.generateSecret({ length: 20 });

    console.log("secret ",secret)
    // Generate the OTP
    const otp = speakeasy.totp({ secret: secret.base32, encoding: 'base32',digits: 6  });
    console.log("otp ",otp)
    // Encrypt the secret and OTP
    const encryptedSecret = encrypt(secret.base32);
    const encryptedOtp = encrypt(otp);
    // console.log("encSec ",encryptedSecret)
    // console.log("encOtp ",encryptedOtp)
    const otpPayload = {email,
        otpSecret: encryptedSecret.encryptedData,
        otp: encryptedOtp.encryptedData,
        otpIv: encryptedSecret.iv // Store the IV for decryption
        }
    await OTP.create(otpPayload);


    // let result = await OTP.findOne({otp})
    // // this is a very poor approach. TODO:: explore speakeasy package 
    // while(result){
    //     otp = otpGenerator.generate(6,{
    //         lowerCaseAlphabets:false,
    //         upperCaseAlphabets:false,
    //         specialChars:false
    //     });
    
    //      result = await OTP.findOne({otp})
    // }

        // const otpPayload = {email,otp}

        // await OTP.create(otpPayload);

        res.status(200).json({
            success:true,
            message:"otp Sent ",
            otp: encryptedOtp.encryptedData
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"problem, geneating otp",
            error:error
        });
    }
}

//signup
const signup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password, 
            confirmPassword,
            contactNumber, 
            accountType,
            otp
        }= req.body;
        console.log("email",email)
        //validate 
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"Please fill all the field.",
            })
        }
        
        //check passwords
        if( password !== confirmPassword ){
            return res.status(400).json({
                success:false,
                message:"Passwords do not match.",
            })
        }
        
        //check user with the same email in db
        const user = await User.findOne({email})
        console.log("user",user)
        if(user){
            return res.status(400).json({
                success:false,
                message:"User with the same email exists.",
            })
        }
        
        // retrieve most recent otp from db
        const recentOtp = await OTP.findOne({email}).sort({createrAt:-1}).limit(1)
        console.log("recentOtp", recentOtp)
        if(!recentOtp){
            return res.status(400).json({
                success:false,
                message:"OTP not found.",
            });
        }
        // Decrypt the stored OTP
        const decryptedOtp = decrypt({ iv: recentOtp.otpIv, encryptedData: recentOtp.otp });
        console.log("decryptedOtp", decryptedOtp)
        
        // Compare the decrypted OTP with the user-entered OTP
        if(otp !== decryptedOtp){
            return res.status(400).json({
                success:false,
                message:"invalid OTP.",
              });
         }


        // hash password
        
        const hashpass = await bcrypt.hash(password,10)
        console.log("hashpass", hashpass)
        
        const profileDetail= await Profile.create({
            gander:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        }) // user model mai use ho raha hai tho is waja se start mai null dena prh raha hai
        console.log("profileDetail", profileDetail)
        
        const savePass = await User.create({
            firstName,
            lastName,
            email,
            password:hashpass, 
            contactNumber, 
            accountType,
            additionalDetails:profileDetail._id, // id use ki hai user model mai
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });
        console.log("savePass", savePass)
        res.status(200).json({
            success:true,
            message:"User registered successfully.",
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"User cannot be registered, Please try again.",
            error:error
        });
    }
}

//login
const login = async (req, res) => {

    try {
        // take data from req body

        const {email, password} = req.body;
        // validate
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"Please fill all the field.",
            })
        }
        // check for the email if registered
        const registeredUser = await User.findOne({email})
        if(!registeredUser){
            return res.status(401).json({
                success:false,
                message:"User is not registered.",
            })
        }

        // generate jwt if the hashed pass is compared with user entered pass
        const matchPass = await bcrypt.compare(password, registeredUser.password)
        if(matchPass){
            const payload = { 
                userId: registeredUser._id,
                email: registeredUser.email,
                accountType: registeredUser.accountType
            }
            const token = jwt.sign(payload, process.env.SECRET_KEY, {
                expiresIn:"2h"
            })

            registeredUser.token = token;
            registeredUser.password = undefined; //cookie mai user snd krna hai is leye password ko hatana hoga
            // send token in cookie
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true
            }

            res.cookie("token", token, options).status(200).json({
                success:true,
                registeredUser,
                token,
                message:"Loggin Successfully."
            })
        }else{
            return res.status(401).json({
                success:false,
                message:"Invalid Password.",
            })
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Login failed. Please try again later.",
        })
    }
}

//change password 

export {sendOTP, signup, login}