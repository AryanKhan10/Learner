import mongoose from "mongoose";

const subSectionSchema = new mongoose.Schema(
    {
        videoURL:{
            type: String
        },
        timeDuration:{
            type: String
        },
        title: {
            type:String
        },
        description: {
            type:String
        }
        
    },{timestamps: true}
);

export const SubSection = mongoose.model("SubSection", subSectionSchema)