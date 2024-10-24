import {Section}  from "../models/section.model.js";
import {Course}  from "../models/course.model.js";

const createSection = async (req, res) => {
    try {
        // get name and course id ( id k base pe hi course k schema mai section update hoga na )
        const {name, courseId} = req.body;

        if(!name || !courseId){
            return res.status(401).json({
                success:false,
                message:"All fields are required.",
            })
        }
        //create section
        const section = await Section.create({name})
        
        //update course by adding section to it
        const course = await Course.findByIdAndUpdate({courseId}, {$push:{courseContent:section._id}},{new:true})

        res.status(200).json({
            success:true,
            message:"Section created successfully.",
            course
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Something went wrong while creating section.",
            error:error
        })
    }
}

const updateSection = async (req, res) => {
    try {
        const {name, sectionId} = req.body;
        if(!name || !sectionId){
            return res.status(401).json({
                success:false,
                message:"All fields are required.",
            })
        }

        const section = await Section.findByIdAndUpdate(sectionId, {name}, {new:true})
        res.status(200).json({
            success:true,
            message:"Section updated successfully.",
            section
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Something went wrong while updating the section.",
            error:error
        })
    }
}

const deleteSection = async (req, res) => {
    try {
        const {sectionId} = req.params; // /sectin:id

        //dlt section
        await Section.findByIdAndDelete({sectionId})

        //remove the section from course (pull out section from an array of cource section in course schema )
        await Course.updateOne({courseContent : sectionId},{$pull:{courseContent:sectionId}})

        res.status(200).json({
            success:true,
            message:"Section deleted successfully.",
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Something went wrong while deleting the section.",
            error:error
        })
    }
}

export {createSection, updateSection, deleteSection}
