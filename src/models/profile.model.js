import mongoose from "mongoose";

const profileShema = new mongoose.Schema(
    {
        gender:{
            type: String,
        },
        dateOfBirth:{
            type: String,
        },
        about:{
            type: String,
            trim: true
        },
        contactNumber:{
            type: Number,
            trim: true
        },
        
    },{timestamps: true}
);

export const Profile = mongoose.model("profile", profileShema)