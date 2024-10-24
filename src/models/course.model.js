import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        courseTitle:{
            type: String,
            required: true,
        },
        courseDescription:{
            type: String,
            required: true,
        },
        thumbnail:{
            type: String,
            required: true,
        },
        whatYouWillLearn:{
            type: String
        },
        price:{
            type: Number
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:"User"
        },
        ratingAndReview: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"RatingAndReview"
            }
        ],
        category: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Category"
            },
        tag:{
            type:String
        },
        studentsEnrolled: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required:true,
                ref:"User"
            }
        ],
        courseContent: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Section"
            }
        ],
    },{timestamps: true}
);

export const Course = mongoose.model("Course", courseSchema)