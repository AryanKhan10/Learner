import mongoose from "mongoose";

const userShema = new mongoose.Schema(
    {
        firstName:{
            type: String,
            required: true,
            trim: true
        },
        lastName:{
            type: String,
            required: true,
            trim: true
        },
        email:{
            type: String,
            required: true,
            trim: true
        },
        password:{
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },       
        accountType:{
            type: String,
            enum:["Admin", "Student", "Instructor"],
            required: true
        },
        additionalDetails: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:"Profile"
        },
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Course"
            }
        ],
        courseProgress: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"CourseProgress"
            }
        ],
        token:{ // for reset password
            type: String
        },
        resetPasswordExpire: {
            type:Date,
        }
    },{timestamps: true}
);

export const User = mongoose.model("User", userShema)