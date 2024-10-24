import mongoose from "mongoose";

const RatingAndReviewSchema = new mongoose.Schema(
    {
        course:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Course",
            required: true
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true
        },
        rating:{
            type: Number,
            required: true
        },
        review:{
            type: String,
            required: true
        }
        
    },{timestamps: true}
);

export const RatingAndReview = mongoose.model("RatingAndReview", RatingAndReviewSchema)