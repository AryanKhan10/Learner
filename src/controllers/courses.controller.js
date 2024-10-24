import {Category} from "../models/category.model.js"
import {Course} from "../models/course.model.js"
import fileUpload from "../utiles/fileUpload.js";

const createCourse = async (req, res) => {
    try {
        const {courseTitle, courseDescription, whatYouWillLearn, price, tag } = req.body; // tag id hogi yaha
        const thumbnail = req.files.file;

        if(!courseTitle || courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success:false,
                message:"All fields are required.",
                })
        }


        //fetch instructor details
        const userID = req.user.id;
        const instructorDetails = await user.findById(userID)

        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:"Instructor not found.",
                })
        }
        // validate tag

        const tagDetails = await Category.findById(tag);

        if(!tagDetails){
            return res.status(400).json({
                success:false,
                message:"Tag not found.",
                })
        }

        //file upload

        const image = await fileUpload(thumbnail, process.env.FOLDER)

        const course = await Course.create({
            courseTitle:courseTitle,
            courseDescription:courseDescription,
            whatYouWillLearn:whatYouWillLearn,
            price:price,
            thumbnail:image.secure_url,
            instructor:instructorDetails._id,
            tag:tag._id
        },{new:true})

        //add course to the user schema of instructor

        await User.findByIdAndUpdate({_id:instructorDetails._id},{$push:{courses:course._id}})

        await Tag.findByIdAndUpdate({_id:tagDetails._id},{$push:{courses:course._id}})

        res.status(200).json({
            success:true,
            message:"Course Created.",
            course
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"something went wrong while creating course.",
            error:error
        })
    }
}
const getCourseDetails = async (req, res) => {
    try {
        const {courseId} = req.body;
        const courseDetaills =  await Course.findById(courseId)
                            .populate(
                                {
                                    path:"instructor",
                                    populate:{
                                        path:"additionDetails"
                                    }
                                }
                            )
                            .populate("ratingAndReview")
                            .populate("category")
                            .populate({
                                path:"courseContent",
                                populate:{
                                    path:"subSection"
                                }
                            })

        if(!courseDetaills){
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            })
        }    

        res.status(200).json({
            success: true,
            message: "Course found.",
            Data: courseDetaills
        })

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching course.",
            error: error
        })
    }
}
const getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}).populate("instructor").exec()

        res.status(200).json({
            success: true,
            message:"fetched courses.",
            allCourses

        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Couldn't get any Course.",
            error:error
        })
    }
}

export { createCourse, getCourseDetails, getAllCourses }